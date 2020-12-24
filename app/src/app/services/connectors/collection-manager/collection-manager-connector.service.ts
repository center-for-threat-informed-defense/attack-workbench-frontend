import { HttpClient, HttpHeaders, HttpParameterCodec, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CollectionIndex } from 'src/app/classes/collection-index';
import { environment } from "../../../../environments/environment";
import { ApiConnector } from '../api-connector';

@Injectable({
    providedIn: 'root'
})
export class CollectionManagerConnectorService extends ApiConnector {
    private get baseUrl(): string { return `${environment.integrations.collection_manager.url}:${environment.integrations.collection_manager.port}/api`; }

    constructor(private http: HttpClient, private snackbar: MatSnackBar) { super(snackbar) }

    /**
     * Given a URL, retrieve the collection index at the URL
     * @param {string} url the URL of the collection index
     * @returns {Observable<CollectionIndex>} the collection index at the URL
     */
    public getRemoteIndex(url: string): Observable<CollectionIndex> {
        let params = new HttpParams({encoder: new CustomEncoder()}).set("url", url);
        return this.http.get<CollectionIndex>(`${this.baseUrl}/collection-indexes/remote`, {params}).pipe( 
            tap(_ => console.log("downloaded index at", url)), // on success, trigger the success notification   
            catchError(this.handleError_single<CollectionIndex>()) // on error, trigger the error notification and continue operation without crashing (returns empty item)
        )
    }
}

//custom encoder for query params with URLs in them
class CustomEncoder implements HttpParameterCodec {
    encodeKey(key: string): string {
        return encodeURIComponent(key);
    }
    encodeValue(value: string): string {
        return encodeURIComponent(value);
    }
    decodeKey(key: string): string {
        return decodeURIComponent(key);
    }
    decodeValue(value: string): string {
        return decodeURIComponent(value);
    }    
}