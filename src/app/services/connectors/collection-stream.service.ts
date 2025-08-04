// services/collection-stream.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { logger } from 'src/app/utils/logger';

export interface StreamProgress {
  total: number;
  loaded: number;
  percentage: number;
}

export interface CollectionStreamData {
  type: 'collection' | 'contentCount' | 'content';
  data?: any;
  count?: number;
  position?: number;
  object?: any;
}

@Injectable({
  providedIn: 'root',
})
export class CollectionStreamService {
  constructor(private ngZone: NgZone) {}

  streamCollection(url: string): Observable<CollectionStreamData> {
    return new Observable(observer => {
      // Note: EventSource doesn't support custom headers in the browser
      // Authentication must be handled via cookies (withCredentials)
      const eventSource = new EventSource(url, {
        withCredentials: true,
      });

      eventSource.onmessage = event => {
        this.ngZone.run(() => {
          try {
            const data = JSON.parse(event.data);
            observer.next(data);
          } catch (err) {
            logger.error('Error parsing SSE data:', err);
            observer.error(err);
          }
        });
      };

      eventSource.addEventListener('complete', () => {
        this.ngZone.run(() => {
          eventSource.close();
          observer.complete();
        });
      });

      eventSource.onerror = error => {
        this.ngZone.run(() => {
          logger.error('EventSource error:', error);
          eventSource.close();
          observer.error(new Error('Stream connection failed'));
        });
      };

      // Handle custom error events from server
      eventSource.addEventListener('error', (event: any) => {
        this.ngZone.run(() => {
          eventSource.close();
          try {
            const errorData = JSON.parse(event.data);
            observer.error(new Error(errorData.error));
          } catch {
            observer.error(new Error('Unknown server error'));
          }
        });
      });

      // Cleanup on unsubscribe
      return () => {
        eventSource.close();
      };
    });
  }
}
