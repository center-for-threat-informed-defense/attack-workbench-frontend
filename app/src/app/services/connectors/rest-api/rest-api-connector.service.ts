import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CollectionIndexRecord } from 'src/app/classes/collection-index';
import { environment } from "../../../../environments/environment";
import { ApiConnector } from '../api-connector';

@Injectable({
    providedIn: 'root'
})
export class RestApiConnectorService extends ApiConnector {
    private get baseUrl(): string { return `${environment.integrations.rest_api.url}:${environment.integrations.rest_api.port}/api`; }

    constructor(private http: HttpClient, private snackbar: MatSnackBar) { super(snackbar); }

    /**
     * Post a new collection index to the back-end
     * @param {CollectionIndexRecord} index record to write
     * @returns {Observable<CollectionIndexRecord>} posted index if successful
     */
    public postCollectionIndex(index: CollectionIndexRecord): Observable<CollectionIndexRecord> {
        return this.http.post<CollectionIndexRecord>(`${this.baseUrl}/collection-indexes`, index).pipe(
            tap(this.handleSuccess("collection index added")),
            catchError(this.handleError_single<CollectionIndexRecord>())
        )
    }

    /**
     * Update the given collection index
     * @param {CollectionIndexRecord} index the index to update
     * @param {string} [successMessage="collection index updated"] message to show to the user in the snackbar on success
     * @returns {Observable<CollectionIndexRecord>} the updated record
     */
    public putCollectionIndex(index: CollectionIndexRecord, successMessage: string = "collection index updated"): Observable<CollectionIndexRecord> {
        return this.http.put<CollectionIndexRecord>(`${this.baseUrl}/collection-indexes/${index.collection_index.id}`, index).pipe(
            tap(this.handleSuccess(successMessage)),
            catchError(this.handleError_single<CollectionIndexRecord>())
        )
    }

    /**
     * Fetch all collection indexes
     * @param {number} limit optional, number to retrieve
     * @param {number} offset optional, number to skip
     * @returns {Observable<CollectionIndexRecord>} collection indexes
     */
    public getCollectionIndexes(limit?: number, offset?: number): Observable<CollectionIndexRecord[]> {
        return this.http.get<CollectionIndexRecord[]>(`${this.baseUrl}/collection-indexes`).pipe(
            tap(_ => console.log("retrieved collection indexes")), // on success, trigger the success notification   
            catchError(this.handleError_array<CollectionIndexRecord[]>([])) // on error, trigger the error notification and continue operation without crashing (returns empty item)
        )
    }

    /**
     * Delete the given collection index
     * @param {string} id the ID of the collection index to delete
     */
    public deleteCollectionIndex(id: string) {
        return this.http.delete(`${this.baseUrl}/collection-indexes/${id}`).pipe(
            tap(this.handleSuccess("collection index removed")),
            catchError(this.handleError_single())
        )
    }
}
