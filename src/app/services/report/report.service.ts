import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  get apiUrl(): string {
    return environment.integrations.rest_api.url;
  }

  getMissingLinkById(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/link-by-id/missing`);
  }

  getParallelRelationships(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/parallel-relationships`);
  }
}
