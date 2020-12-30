import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { CollectionIndex } from 'src/app/classes/collection-index';
import { environment } from "../../../../environments/environment";
import { ApiConnector } from '../api-connector';

@Injectable({
    providedIn: 'root'
})
export class RestApiConnectorService extends ApiConnector {
    private get baseUrl(): string { return `${environment.integrations.rest_api.url}:${environment.integrations.rest_api.port}/api`; }
    private headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(private http: HttpClient, private snackbar: MatSnackBar) { super(snackbar); }

    /**
     * Post a new collection index to the back-end
     * @param {CollectionIndex} index record to write
     * @returns {Observable<CollectionIndex>} posted index if successful
     */
    public postCollectionIndex(index: CollectionIndex): Observable<CollectionIndex> {
        return this.http.post<CollectionIndex>(`${this.baseUrl}/collection-indexes`, index, {headers: this.headers}).pipe(
            tap(this.handleSuccess("collection index added")),
            map(result => result as CollectionIndex),
            catchError(this.handleError_single<CollectionIndex>())
        )
    }

    /**
     * Update the given collection index
     * @param {CollectionIndex} index the index to update
     * @param {string} [successMessage="collection index updated"] message to show to the user in the snackbar on success
     * @returns {Observable<CollectionIndex>} the updated record
     */
    public putCollectionIndex(index: CollectionIndex, successMessage: string = "collection index updated"): Observable<CollectionIndex> {
        let serialized = index.serialize()
        console.log(serialized);
        return this.http.put<CollectionIndex>(`${this.baseUrl}/collection-indexes/${index.collection_index.id}`, serialized, {headers: this.headers}).pipe(
            tap(this.handleSuccess(successMessage)),
            map(result => new CollectionIndex(result)),
            catchError(this.handleError_single<CollectionIndex>())
        )
    }

    /**
     * Fetch all collection indexes
     * @param {number} limit optional, number to retrieve
     * @param {number} offset optional, number to skip
     * @returns {Observable<CollectionIndex>} collection indexes
     */
    public getCollectionIndexes(limit?: number, offset?: number): Observable<CollectionIndex[]> {
        return this.http.get<CollectionIndex[]>(`${this.baseUrl}/collection-indexes`, {headers: this.headers}).pipe(
            tap(_ => console.log("retrieved collection indexes")), // on success, trigger the success notification
            map(results => { return results.map(raw => new CollectionIndex(raw)); }),
            catchError(this.handleError_array<CollectionIndex[]>([])) // on error, trigger the error notification and continue operation without crashing (returns empty item)
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
