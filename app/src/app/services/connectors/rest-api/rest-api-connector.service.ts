import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { CollectionIndex } from 'src/app/classes/collection-index';
import { Collection } from 'src/app/classes/stix/collection';
import { Group } from 'src/app/classes/stix/group';
import { Matrix } from 'src/app/classes/stix/matrix';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { Relationship } from 'src/app/classes/stix/relationship';
import { Software } from 'src/app/classes/stix/software';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { environment } from "../../../../environments/environment";
import { ApiConnector } from '../api-connector';

type AttackType = "collection" | "group" | "matrix" | "mitigation" | "software" | "tactic" | "technique" | "relationship";
const attackTypeToPlural = {
    "technique": "techniques",
    "tactic": "tactics",
    "group": "groups",
    "software": "software",
    "mitigation": "mitigations",
    "matrix": "matrices",
    "collection": "collections",
    "relationship": "relationships"
}
const attackTypeToClass = {
    "technique": Technique,
    "tactic": Tactic,
    "group": Group,
    "software": Software,
    "mitigation": Mitigation,
    "matrix": Matrix,
    "collection": Collection,
    "relationship": Relationship
}
@Injectable({
    providedIn: 'root'
})
export class RestApiConnectorService extends ApiConnector {
    private get baseUrl(): string { return `${environment.integrations.rest_api.url}:${environment.integrations.rest_api.port}/api`; }
    private headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(private http: HttpClient, private snackbar: MatSnackBar) { super(snackbar); }

    //   ___ _____ _____  __       _   ___ ___ ___ 
    //  / __|_   _|_ _\ \/ /      /_\ | _ \_ _/ __|
    //  \__ \ | |  | | >  <      / _ \|  _/| |\__ \
    //  |___/ |_| |___/_/\_\    /_/ \_\_| |___|___/
    //                                            

    /**
     * Factory to create a new STIX get-all function
     * @template T the type to get
     * @param {AttackType} attackType the type to get
     * @returns getter function
     */
    private getStixObjectsFactory<T>(attackType: AttackType) {
        let attackClass = attackTypeToClass[attackType];
        let plural = attackTypeToPlural[attackType]
        return function<P extends T>(limit?: number, offset?: number, state?: string, revoked?: boolean, deprecated?: boolean): Observable<P[]> {
            let url = `${this.baseUrl}/${plural}`;
            return this.http.get(url, {headers: this.headers}).pipe(
                tap(_ => console.log(`retrieved ${plural}`)), // on success, trigger the success notification
                map(results => { 
                    let x = results as Array<any>;
                    return x.map(raw => new attackClass(raw));
                }),
                catchError(this.handleError_array([])) // on error, trigger the error notification and continue operation without crashing (returns empty item)
            )
        }
    }

    /**
     * Get all techniques
     * @param {number} [limit] the number of techniques to retrieve
     * @param {number} [offset] the number of techniques to skip
     * @param {string} [state] if specified, only get objects with this state
     * @param {boolean} [revoked] if true, get revoked objects
     * @param {boolean} [deprecated] if true, get deprecated objects
     * @returns {Observable<Technique[]>} observable of retrieved objects
     */
    public get getAllTechniques() { return this.getStixObjectsFactory<Technique>("technique") }
    /**
     * Get all tactics
     * @param {number} [limit] the number of tactics to retrieve
     * @param {number} [offset] the number of tactics to skip
     * @param {string} [state] if specified, only get objects with this state
     * @param {boolean} [revoked] if true, get revoked objects
     * @param {boolean} [deprecated] if true, get deprecated objects
     * @returns {Observable<Tactic[]>} observable of retrieved objects
     */
    public get getAllTactics() { return this.getStixObjectsFactory<Tactic>("tactic") }
    /**
     * Get all groups
     * @param {number} [limit] the number of groups to retrieve
     * @param {number} [offset] the number of groups to skip
     * @param {string} [state] if specified, only get objects with this state
     * @param {boolean} [revoked] if true, get revoked objects
     * @param {boolean} [deprecated] if true, get deprecated objects
     * @returns {Observable<Group[]>} observable of retrieved objects
     */
    public get getAllGroups() { return this.getStixObjectsFactory<Group>("group") }
    /**
     * Get all software
     * @param {number} [limit] the number of software to retrieve
     * @param {number} [offset] the number of software to skip
     * @param {string} [state] if specified, only get objects with this state
     * @param {boolean} [revoked] if true, get revoked objects
     * @param {boolean} [deprecated] if true, get deprecated objects
     * @returns {Observable<Software[]>} observable of retrieved objects
     */
    public get getAllSoftware() { return this.getStixObjectsFactory<Software>("software") }
    /**
     * Get all mitigations
     * @param {number} [limit] the number of mitigations to retrieve
     * @param {number} [offset] the number of mitigations to skip
     * @param {string} [state] if specified, only get objects with this state
     * @param {boolean} [revoked] if true, get revoked objects
     * @param {boolean} [deprecated] if true, get deprecated objects
     * @returns {Observable<Mitigation[]>} observable of retrieved objects
     */
    public get getAllMitigations() { return this.getStixObjectsFactory<Mitigation>("mitigation") }
    /**
     * Get all matrices
     * @param {number} [limit] the number of matrices to retrieve
     * @param {number} [offset] the number of matrices to skip
     * @param {string} [state] if specified, only get objects with this state
     * @param {boolean} [revoked] if true, get revoked objects
     * @param {boolean} [deprecated] if true, get deprecated objects
     * @returns {Observable<Matrix[]>} observable of retrieved objects
     */
    public get getAllMatrices() { return this.getStixObjectsFactory<Matrix>("matrix") }

    /**
     * Factory to create a new STIX get by ID function
     * @template T the type to get
     * @param {AttackType} attackType the type to get
     * @returns getter function
     */
    private getStixObjectFactory<T>(attackType: AttackType) {
        let attackClass = attackTypeToClass[attackType];
        let plural = attackTypeToPlural[attackType]
        return function<P extends T>(id: string, modified?: Date): Observable<P> {
            let url = `${this.baseUrl}/${plural}/${id}`;
            if (modified) url += `/modified/${modified}`;
            return this.http.get(url, {headers: this.headers}).pipe(
                tap(_ => console.log(`retrieved ${plural}`)), // on success, trigger the success notification
                map(result => { 
                    let x = result as any;
                    return new attackClass(x);
                }),
                catchError(this.handleError_single()) // on error, trigger the error notification and continue operation without crashing (returns empty item)
            )
        }
    }
    /**
     * Get a single technique by STIX ID
     * @param {string} id the object STIX ID
     * @param {Date} [modified] if specified, get the version modified at the given date
     * @returns {Observable<Technique>} the object with the given ID and modified date
     */
    public get getTechnique() { return this.getStixObjectFactory<Technique>("technique") }
    /**
     * Get a single tactic by STIX ID
     * @param {string} id the object STIX ID
     * @param {Date} [modified] if specified, get the version modified at the given date
     * @returns {Observable<Tactic>} the object with the given ID and modified date
     */
    public get getTactic() { return this.getStixObjectFactory<Tactic>("tactic") }
    /**
     * Get a single group by STIX ID
     * @param {string} id the object STIX ID
     * @param {Date} [modified] if specified, get the version modified at the given date
     * @returns {Observable<Group>} the object with the given ID and modified date
     */
    public get getGroup() { return this.getStixObjectFactory<Group>("group") }
    /**
     * Get a single software by STIX ID
     * @param {string} id the object STIX ID
     * @param {Date} [modified] if specified, get the version modified at the given date
     * @returns {Observable<Software>} the object with the given ID and modified date
     */
    public get getSoftware() { return this.getStixObjectFactory<Software>("software") }
    /**
     * Get a single mitigation by STIX ID
     * @param {string} id the object STIX ID
     * @param {Date} [modified] if specified, get the version modified at the given date
     * @returns {Observable<Mitigation>} the object with the given ID and modified date
     */
    public get getMitigation() { return this.getStixObjectFactory<Mitigation>("mitigation") }
    /**
     * Get a single matrix by STIX ID
     * @param {string} id the object STIX ID
     * @param {Date} [modified] if specified, get the version modified at the given date
     * @returns {Observable<Matrix>} the object with the given ID and modified date
     */
    public get getMatrix() { return this.getStixObjectFactory<Matrix>("matrix") }

    // private getStixObjectFactory(attackType: AttackType): function {}
    // private postStixObjectFactory(attackType: AttackType): function {}
    // private putStixObjectFactory(attackType: AttackType): function {}
    // private deleteStixObjectFactory(attackType: AttackType): function {}
    

    // public getStixObjects<T extends StixObject>(attackType: AttackType, limit?: number, offset?: number, state?: string, revoked?: boolean, deprecated?: boolean): Observable<T[]> {
    //     let url = `${this.baseUrl}/${attackTypeToPlural[attackType]}`;
    // }

    
    // public getStixObject<T extends StixObject>(attackType: AttackType, id: string, modified?: Date): Observable<T> {
    //     let url = `${this.baseUrl}/${attackTypeToPlural[attackType]}/${id}`;
    //     if (modified) url += `/modified/${modified}`;
    // }

    // public postStixObject<T extends StixObject>(object: T): Observable<T> {
    //     let url = `${this.baseUrl}/${attackTypeToPlural[object.attackType]}/${object.stixID}`;

    // }

    // public putStixObject<T extends StixObject>(object: T, modified?: Date): Observable<T> {
    //     let url = `${this.baseUrl}/${attackTypeToPlural[object.attackType]}/${object.stixID}`;
    //     if (modified) url += `/modified/${modified}`;
    // }

    // public deleteStixObject<T extends StixObject>(attackType: AttackType, id: string, modified?: Date): void {
    //     let url = `${this.baseUrl}/${attackTypeToPlural[attackType]}/${id}`;
    //     if (modified) url += `/modified/${modified}`;
    // }


    //    ___ ___  _    _    ___ ___ _____ ___ ___  _  _      ___ _  _ ___  _____  __       _   ___ ___ ___ 
    //   / __/ _ \| |  | |  | __/ __|_   _|_ _/ _ \| \| |    |_ _| \| |   \| __\ \/ /      /_\ | _ \_ _/ __|
    //  | (_| (_) | |__| |__| _| (__  | |  | | (_) | .` |     | || .` | |) | _| >  <      / _ \|  _/| |\__ \
    //   \___\___/|____|____|___\___| |_| |___\___/|_|\_|    |___|_|\_|___/|___/_/\_\    /_/ \_\_| |___|___/
    //                                                                                                     

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
