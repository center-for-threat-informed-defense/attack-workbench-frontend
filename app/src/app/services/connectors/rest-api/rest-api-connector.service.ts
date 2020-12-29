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
    private getStixObjectsFactory<T extends StixObject>(attackType: AttackType) {
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
    public get getAllTechniques() { return this.getStixObjectsFactory<Technique>("technique"); }
    /**
     * Get all tactics
     * @param {number} [limit] the number of tactics to retrieve
     * @param {number} [offset] the number of tactics to skip
     * @param {string} [state] if specified, only get objects with this state
     * @param {boolean} [revoked] if true, get revoked objects
     * @param {boolean} [deprecated] if true, get deprecated objects
     * @returns {Observable<Tactic[]>} observable of retrieved objects
     */
    public get getAllTactics() { return this.getStixObjectsFactory<Tactic>("tactic"); }
    /**
     * Get all groups
     * @param {number} [limit] the number of groups to retrieve
     * @param {number} [offset] the number of groups to skip
     * @param {string} [state] if specified, only get objects with this state
     * @param {boolean} [revoked] if true, get revoked objects
     * @param {boolean} [deprecated] if true, get deprecated objects
     * @returns {Observable<Group[]>} observable of retrieved objects
     */
    public get getAllGroups() { return this.getStixObjectsFactory<Group>("group"); }
    /**
     * Get all software
     * @param {number} [limit] the number of software to retrieve
     * @param {number} [offset] the number of software to skip
     * @param {string} [state] if specified, only get objects with this state
     * @param {boolean} [revoked] if true, get revoked objects
     * @param {boolean} [deprecated] if true, get deprecated objects
     * @returns {Observable<Software[]>} observable of retrieved objects
     */
    public get getAllSoftware() { return this.getStixObjectsFactory<Software>("software"); }
    /**
     * Get all mitigations
     * @param {number} [limit] the number of mitigations to retrieve
     * @param {number} [offset] the number of mitigations to skip
     * @param {string} [state] if specified, only get objects with this state
     * @param {boolean} [revoked] if true, get revoked objects
     * @param {boolean} [deprecated] if true, get deprecated objects
     * @returns {Observable<Mitigation[]>} observable of retrieved objects
     */
    public get getAllMitigations() { return this.getStixObjectsFactory<Mitigation>("mitigation"); }
    /**
     * Get all matrices
     * @param {number} [limit] the number of matrices to retrieve
     * @param {number} [offset] the number of matrices to skip
     * @param {string} [state] if specified, only get objects with this state
     * @param {boolean} [revoked] if true, get revoked objects
     * @param {boolean} [deprecated] if true, get deprecated objects
     * @returns {Observable<Matrix[]>} observable of retrieved objects
     */
    public get getAllMatrices() { return this.getStixObjectsFactory<Matrix>("matrix"); }

    /**
     * Factory to create a new STIX get by ID function
     * @template T the type to get
     * @param {AttackType} attackType the type to get
     * @returns getter function
     */
    private getStixObjectFactory<T extends StixObject>(attackType: AttackType) {
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
    public get getTechnique() { return this.getStixObjectFactory<Technique>("technique"); }
    /**
     * Get a single tactic by STIX ID
     * @param {string} id the object STIX ID
     * @param {Date} [modified] if specified, get the version modified at the given date
     * @returns {Observable<Tactic>} the object with the given ID and modified date
     */
    public get getTactic() { return this.getStixObjectFactory<Tactic>("tactic"); }
    /**
     * Get a single group by STIX ID
     * @param {string} id the object STIX ID
     * @param {Date} [modified] if specified, get the version modified at the given date
     * @returns {Observable<Group>} the object with the given ID and modified date
     */
    public get getGroup() { return this.getStixObjectFactory<Group>("group"); }
    /**
     * Get a single software by STIX ID
     * @param {string} id the object STIX ID
     * @param {Date} [modified] if specified, get the version modified at the given date
     * @returns {Observable<Software>} the object with the given ID and modified date
     */
    public get getSoftware() { return this.getStixObjectFactory<Software>("software"); }
    /**
     * Get a single mitigation by STIX ID
     * @param {string} id the object STIX ID
     * @param {Date} [modified] if specified, get the version modified at the given date
     * @returns {Observable<Mitigation>} the object with the given ID and modified date
     */
    public get getMitigation() { return this.getStixObjectFactory<Mitigation>("mitigation"); }
    /**
     * Get a single matrix by STIX ID
     * @param {string} id the object STIX ID
     * @param {Date} [modified] if specified, get the version modified at the given date
     * @returns {Observable<Matrix>} the object with the given ID and modified date
     */
    public get getMatrix() { return this.getStixObjectFactory<Matrix>("matrix"); }

    /**
     * Factory to create a new STIX object creator (POST) function
     * @template T the type to create
     * @param {AttackType} attackType tehe type to create
     * @returns creator (POST) function
     */
    private postStixObjectFactory<T extends StixObject>(attackType: AttackType) {
        let attackClass = attackTypeToClass[attackType];
        let plural = attackTypeToPlural[attackType];
        return function<P extends T>(object: P): Observable<P> {
            let url = `${this.baseUrl}/${plural}`;
            return this.http.post(url, object, {headers: this.headers}).pipe(
                tap(this.handleSuccess(`${attackType} created`)),
                map(result => {
                    let x = result as any;
                    return new attackClass(x);
                }),
                catchError(this.handleError_single())
            )
        }
    }

    /**
     * POST (create) a new technique
     * @param {Technique} object the object to create
     * @returns {Observable<Technique>} the created object
     */
    public get postTechnique() { return this.postStixObjectFactory<Technique>("technique"); }
    /**
     * POST (create) a new tactic
     * @param {Tactic} object the object to create
     * @returns {Observable<Tactic>} the created object
     */
    public get postTactic() { return this.postStixObjectFactory<Tactic>("tactic"); }
    /**
     * POST (create) a new group
     * @param {Group} object the object to create
     * @returns {Observable<Group>} the created object
     */
    public get postGroup() { return this.postStixObjectFactory<Group>("group"); }
    /**
     * POST (create) a new software
     * @param {Software} object the object to create
     * @returns {Observable<Software>} the created object
     */
    public get postSoftware() { return this.postStixObjectFactory<Software>("software"); }
    /**
     * POST (create) a new mitigation
     * @param {Mitigation} object the object to create
     * @returns {Observable<Mitigation>} the created object
     */
    public get postMitigation() { return this.postStixObjectFactory<Mitigation>("mitigation"); }
    /**
     * POST (create) a new matrix
     * @param {Matrix} object the object to create
     * @returns {Observable<Matrix>} the created object
     */
    public get postMatrix() { return this.postStixObjectFactory<Matrix>("matrix"); }

    /**
     * Factory to create a new STIX put (update) function
     * @template T the type to put
     * @param {AttackType} attackType the type to put
     * @returns put function
     */
    private putStixObjectFactory<T extends StixObject>(attackType: AttackType) {
        let attackClass = attackTypeToClass[attackType];
        let plural = attackTypeToPlural[attackType];
        return function<P extends T>(object: T, modified?: Date): Observable<P> {
            if (!modified) modified = object.modified; //infer modified from STIX object modified date
            let url = `${this.baseUrl}/${plural}/${object.stixID}/modified/${modified}`;
            return this.http.put(url, object, {headers: this.headers}).pipe(
                tap(this.handleSuccess(`updated ${attackType}`)),
                map(result => {
                    let x = result as any;
                    return new attackClass(x);
                }),
                catchError(this.handleError_single())
            )
        }
    }

    /**
     * PUT (update) a technique
     * @param {Technique} object the object to update
     * @param {Date} [modified] optional, the modified date to overwrite. If omitted, uses the modified field of the object
     * @returns {Observable<Technique>} the updated object
     */
    public get putTechnique() { return this.putStixObjectFactory<Technique>("technique"); }
    /**
     * PUT (update) a tactic
     * @param {Tactic} object the object to update
     * @param {Date} [modified] optional, the modified date to overwrite. If omitted, uses the modified field of the object
     * @returns {Observable<Tactic>} the updated object
     */
    public get putTactic() { return this.putStixObjectFactory<Tactic>("tactic"); }
    /**
     * PUT (update) a group
     * @param {Group} object the object to update
     * @param {Date} [modified] optional, the modified date to overwrite. If omitted, uses the modified field of the object
     * @returns {Observable<Group>} the updated object
     */
    public get putGroup() { return this.putStixObjectFactory<Group>("group"); }
    /**
     * PUT (update) a software
     * @param {Software} object the object to update
     * @param {Date} [modified] optional, the modified date to overwrite. If omitted, uses the modified field of the object
     * @returns {Observable<Software>} the updated object
     */
    public get putSoftware() { return this.putStixObjectFactory<Software>("software"); }
    /**
     * PUT (update) a mitigation
     * @param {Mitigation} object the object to update
     * @param {Date} [modified] optional, the modified date to overwrite. If omitted, uses the modified field of the object
     * @returns {Observable<Mitigation>} the updated object
     */
    public get putMitigation() { return this.putStixObjectFactory<Mitigation>("mitigation"); }
    /**
     * PUT (update) a matrix
     * @param {Matrix} object the object to update
     * @param {Date} [modified] optional, the modified date to overwrite. If omitted, uses the modified field of the object
     * @returns {Observable<Matrix>} the updated object
     */
    public get putMatrix() { return this.postStixObjectFactory<Matrix>("matrix"); }

    private deleteStixObjectFactory(attackType: AttackType) {
        let plural = attackTypeToPlural[attackType];
        return function(id: string, modified: Date): Observable<{}> {
            let url = `${this.baseUrl}/${plural}/${id}/modified/${modified}`;
            return this.http.delete(url).pipe(
                tap(this.handleSuccess(`${attackType} deleted`)),
                catchError(this.handleError_single())
            );
        }
    }

    /**
     * DELETE a technique
     * @param {string} id the STIX ID of the object to delete
     * @param {Date} modified the modified date of the version to delete
     * @returns {Observable<{}>} observable of the response body
     */
    public get deleteTechnique() { return this.deleteStixObjectFactory("technique"); }
    /**
     * DELETE a tactic
     * @param {string} id the STIX ID of the object to delete
     * @param {Date} modified the modified date of the version to delete
     * @returns {Observable<{}>} observable of the response body
     */
    public get deleteTactic() { return this.deleteStixObjectFactory("tactic"); }
    /**
     * DELETE a group
     * @param {string} id the STIX ID of the object to delete
     * @param {Date} modified the modified date of the version to delete
     * @returns {Observable<{}>} observable of the response body
     */
    public get deleteGroup() { return this.deleteStixObjectFactory("group"); }
    /**
     * DELETE a software
     * @param {string} id the STIX ID of the object to delete
     * @param {Date} modified the modified date of the version to delete
     * @returns {Observable<{}>} observable of the response body
     */
    public get deleteSoftware() { return this.deleteStixObjectFactory("software"); }
    /**
     * DELETE a mitigation
     * @param {string} id the STIX ID of the object to delete
     * @param {Date} modified the modified date of the version to delete
     * @returns {Observable<{}>} observable of the response body
     */
    public get deleteMitigation() { return this.deleteStixObjectFactory("mitigation"); }
    /**
     * DELETE a matrix
     * @param {string} id the STIX ID of the object to delete
     * @param {Date} modified The modified date of the version to delete
     * @returns {Observable<{}>} observable of the response body
     */
    public get deleteMatrix() { return this.deleteStixObjectFactory("matrix"); }


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
    public deleteCollectionIndex(id: string): Observable<{}> {
        return this.http.delete(`${this.baseUrl}/collection-indexes/${id}`).pipe(
            tap(this.handleSuccess("collection index removed")),
            catchError(this.handleError_single())
        )
    }
}
