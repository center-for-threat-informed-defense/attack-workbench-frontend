import { Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";
import { ValidationData } from "../serializable";
import { StixObject } from "./stix-object";
import { logger } from "../../util/logger";

export class Relationship extends StixObject {

    public source_ref: string = "";
    public get source_name(): string {
        return `${this.source_parent ? this.source_parent.stix.name + ': ' : ''}${this.source_object ? this.source_object.stix.name : '[unknown object]'}`;
    }
    public source_ID: string = "";
    public source_object: any;
    public source_parent: any;

    public target_ref: string = "";
    public get target_name(): string {
        return `${this.target_parent ? this.target_parent.stix.name + ': ' : ''}${this.target_object ? this.target_object.stix.name : '[unknown object]'}`;
    }
    public target_ID: string = "";
    public target_object: any;
    public target_parent: any;
    
    public updating_refs: boolean = false; //becomes true while source and target refs are being asynchronously updated.
    
    public relationship_type: string = "";

    public readonly supportsAttackID = false; // relationships do not have ATT&CK IDs
    public readonly supportsNamespace = false; // relationships do not support namespacing
    protected get attackIDValidator() { return null; } // relationships have no ATT&CK ID
    /**
     * The valid source types according to relationship_type
     * null if any type is valid or relationship_type is not recognized
     */
    public get valid_source_types(): string[] {
        if (this.relationship_type == "uses") {
            if (this.target_object && (this.target_object.stix.type == "malware" || this.target_object.stix.type == "tool")) return ["group", "campaign"];
            else return ["software", "group", "campaign"];
        }
        if (this.relationship_type == "mitigates") return ["mitigation"];
        if (this.relationship_type == "subtechnique-of") return ["technique"];
        if (this.relationship_type == "detects") return ["data-component"];
        if (this.relationship_type == "attributed-to") return ["campaign"];
        else return null;
    }
    /**
     * The valid source types according to relationship_type
     * null if any type is valid or relationship_type is not recognized
     */
    public get valid_target_types(): string[] {
        if (this.relationship_type == "uses") {
            if (this.source_object && (this.source_object.stix.type == "malware" || this.source_object.stix.type == "tool")) return ["technique"];
            else return ["software", "technique"];
        }
        if (this.relationship_type == "mitigates") return ["technique"];
        if (this.relationship_type == "subtechnique-of") return ["technique"];
        if (this.relationship_type == "detects") return ["technique"];
        if (this.relationship_type == "attributed-to") return ["group"];
        else return null;
    }

    constructor(sdo?: any) {
        super(sdo, "relationship");
        if (sdo) {
            if ("stix" in sdo) {
                this.deserialize(sdo);
            }
        }
    }
    
    /**
     * set the source ref, and set the source_object and source_id to the new values
     * @param {string} new_source_ref the new source ref
     * @param {RestApiConnectorService} restAPIService: the REST API connector through which the source can be fetched
     * @returns {Observable<Relationship>} of this object after the data has been updated
     */
    public set_source_ref(new_source_ref: string, restAPIService: RestApiConnectorService): Observable<Relationship> {
        this.source_ref = new_source_ref;
        this.updating_refs = true;
        return restAPIService.getAllObjects().pipe(
            map(results => {
                let x = results as any;
                let serialized = this.serialize();
                serialized.source_object = x.find(result => result.stix.id == new_source_ref);
                this.deserialize(serialized);
                return this;
            }),
            switchMap(relationship => {
                if (relationship.source_object.stix.x_mitre_is_subtechnique || relationship.source_object.stix.type == 'x-mitre-data-component') {
                    return this.get_parent_object(relationship.source_object, restAPIService).pipe(
                        map(res => {
                            this.source_parent = res;
                            this.updating_refs = false;
                            return this;
                        })
                    )
                } else {
                    this.source_parent = undefined; // source object has no parent
                    this.updating_refs = false;
                    return of(this);
                }
            })
        )
    }

    /**
     * Set the source object
     * @param {StixObject} new_source_object the object to set
     * @param {RestApiConnectorService} restAPIService: the REST API connector through which the parent of the source can be fetched
     * @returns {Observable<Relationship>} of this object after the data has been updated
     */
    public set_source_object(new_source_object: StixObject, restAPIService: RestApiConnectorService): Observable<Relationship>  {
        this.updating_refs = true;
        this.source_ref = new_source_object.stixID;
        let serialized = this.serialize();
        let modified = new_source_object.modified;
        serialized.source_object = new_source_object.serialize();
        serialized.source_object["stix"].modified = modified ? modified.toISOString() : undefined; // fix modified date overwrite by serialization
        this.deserialize(serialized);

        if (this.source_object.stix.x_mitre_is_subtechnique || this.source_object.stix.type == 'x-mitre-data-component') {
            return this.get_parent_object(this.source_object, restAPIService).pipe(
                map(result => {
                    this.source_parent = result;
                    this.updating_refs = false;
                    return this;
                })
            );
        } else this.source_parent = undefined; // source object has no parent

        this.updating_refs = false;
        return of(this);
    }

    /**
     * set the target ref, and set the target_object and target_id to the new values
     * @param {string} new_target_ref the new target ref
     * @param {RestApiConnectorService} restAPIService: the REST API connector through which the target can be fetched
     * @returns {Observable<Relationship>} of this object after the data has been updated
     */
    public set_target_ref(new_target_ref: string, restAPIService: RestApiConnectorService): Observable<Relationship> {
        this.target_ref = new_target_ref;
        this.updating_refs = true;
        return restAPIService.getAllObjects().pipe(
            map(results => {
                let x = results as any;
                let serialized = this.serialize();
                serialized.target_object = x.find(result => result.stix.id == new_target_ref);
                this.deserialize(serialized);
                return this;
            }),
            switchMap(relationship => {
                if (relationship.target_object.stix.x_mitre_is_subtechnique || relationship.target_object.stix.type == 'x-mitre-data-component') {
                    return this.get_parent_object(relationship.target_object, restAPIService).pipe(
                        map(res => {
                            this.target_parent = res;
                            this.updating_refs = false;
                            return this;
                        })
                    )
                } else {
                    this.target_parent = undefined; // target object has no parent
                    this.updating_refs = false;
                    return of(this);
                }
            })
        )
    }

    /**
     * Set the target object
     * @param {StixObject} new_target_object the object to set
     * @param {RestApiConnectorService} restAPIService: the REST API connector through which the parent of the target can be fetched
     * @returns {Observable<Relationship>} of this object after the data has been updated
     */
    public set_target_object(new_target_object: StixObject, restAPIService: RestApiConnectorService): Observable<Relationship>  {
        this.updating_refs = true;
        this.target_ref = new_target_object.stixID;
        let serialized = this.serialize();
        let modified = new_target_object.modified;
        serialized.target_object = new_target_object.serialize();
        serialized.target_object["stix"].modified = modified ? modified.toISOString() : undefined; // fix modified date overwrite by serialization
        this.deserialize(serialized);

        if (this.target_object.stix.x_mitre_is_subtechnique || this.target_object.stix.type == 'x-mitre-data-component') {
            return this.get_parent_object(this.target_object, restAPIService).pipe(
                map(result => {
                    this.target_parent = result;
                    this.updating_refs = false;
                    return this;
                })
            );
        } else this.target_parent = undefined; // target object has no parent

        this.updating_refs = false;
        return of(this);
    }

    /**
     * Retrieve parent object from the REST API, if applicable.
     * Fetches the parent technique of a sub-technique and the parent data source of
     * a data component.
     * @param {any} object the raw source or target object
     * @param {RestApiConnectorService} restAPIService the REST API connector through which the parent can be fetched
     * @returns {Observable<StixObject>} of the parent object
     */
    public get_parent_object(object: any, restAPIService: RestApiConnectorService): Observable<StixObject> {
        if (object.stix.x_mitre_is_subtechnique) { // sub-technique
            return restAPIService.getRelatedTo({sourceRef: object.stix.id, relationshipType: "subtechnique-of"}).pipe( // fetch parent from REST API
                map(relationship => {
                    if (!relationship || relationship.data.length == 0) return null; // no parent technique found
                    let p = relationship.data[0] as Relationship;
                    return p.target_object;
                })
            );
        } else { // data component
            return restAPIService.getDataSource(object.stix.x_mitre_data_source_ref).pipe( // fetch data source from REST API
                map(data_sources => {
                    if (!data_sources || data_sources.length == 0) return null; // no data source found
                    return data_sources[0].serialize();
                })
            );
        }
    }

    /**
     * Retrieve the parent object of this source object
     * @param {RestApiConnectorService} restAPIService the REST API connector through which the parent can be fetched
     * @returns {Observable<Relationship>} of this object after the source parent has been updated
     */
    public update_source_parent(restAPIService: RestApiConnectorService): Observable<Relationship> {
        this.updating_refs = true;
        return this.get_parent_object(this.source_object, restAPIService).pipe(
            map(result => {
                this.source_parent = result;
                this.updating_refs = false;
                return this;
            })
        );
    }

    /**
     * Retrieve the parent object of this target object
     * @param {RestApiConnectorService} restAPIService the REST API connector through which the parent can be fetched
     * @returns {Observable<Relationship>} of this object after the target parent has been updated
     */
    public update_target_parent(restAPIService: RestApiConnectorService): Observable<Relationship> {
        this.updating_refs = true;
        return this.get_parent_object(this.target_object, restAPIService).pipe(
            map(result => {
                this.target_parent = result;
                this.updating_refs = false;
                return this;
            })
        )
    }

    /**
     * Transform the current object into a raw object for sending to the back-end, stripping any unnecessary fields
     * @abstract
     * @returns {*} the raw object to send
     */
    public serialize(): any {
        let rep = super.base_serialize();
        
        rep.stix.relationship_type = this.relationship_type;
        rep.stix.source_ref = this.source_ref;
        rep.stix.target_ref = this.target_ref;

        return rep;
    }

    /**
     * Parse the object from the record returned from the back-end
     * @abstract
     * @param {*} raw the raw object to parse
     */
    public deserialize(raw: any) {
        let sdoStix = raw.stix;
        if ("source_ref" in sdoStix) {
            if (typeof(sdoStix.source_ref) === "string") this.source_ref = sdoStix.source_ref;
            else logger.error("TypeError: source_ref field is not a string:", sdoStix.source_ref, "(",typeof(sdoStix.source_ref),")")
        }
        if ("target_ref" in sdoStix) {
            if (typeof(sdoStix.target_ref) === "string") this.target_ref = sdoStix.target_ref;
            else logger.error("TypeError: target_ref field is not a string:", sdoStix.target_ref, "(",typeof(sdoStix.target_ref),")")
        }
        if ("relationship_type" in sdoStix) {
            if (typeof(sdoStix.relationship_type) === "string") this.relationship_type = sdoStix.relationship_type;
            else logger.error("TypeError: relationship_type field is not a string:", sdoStix.relationship_type, "(",typeof(sdoStix.relationship_type),")")
        }
        if ("source_object" in raw) {
            this.source_object = raw.source_object;
            
            let src_sdo = raw.source_object.stix;
            if ("external_references" in src_sdo) {
                if (src_sdo.external_references.length > 0 && src_sdo.external_references[0].hasOwnProperty("external_id")) {
                    if (typeof(src_sdo.external_references[0].external_id) === "string") this.source_ID = src_sdo.external_references[0].external_id;
                    else logger.error("TypeError: attackID field is not a string:", src_sdo.external_references[0].external_id, "(", typeof(src_sdo.external_references[0].external_id), ")");
                }
                // else logger.warn("ObjectWarning: cannot find attackID for source object");
            } else this.source_ID = "";
        }
        if ("target_object" in raw) {
            this.target_object = raw.target_object;

            let tgt_sdo = raw.target_object.stix;
            if ("external_references" in tgt_sdo) {
                if (tgt_sdo.external_references.length > 0 && tgt_sdo.external_references[0].hasOwnProperty("external_id")) {
                    if (typeof(tgt_sdo.external_references[0].external_id) === "string") this.target_ID = tgt_sdo.external_references[0].external_id;
                    else logger.error("TypeError: attackID field is not a string:", tgt_sdo.external_references[0].external_id, "(", typeof(tgt_sdo.external_references[0].external_id), ")");
                }
                // else logger.warn("ObjectWarning: cannot find attackID for target object");
            } else this.target_ID = "";
        }
    }

    /**
     * Validate the current object state and return information on the result of the validation
     * @param {RestApiConnectorService} restAPIService: the REST API connector through which asynchronous validation can be completed
     * @returns {Observable<ValidationData>} the validation warnings and errors once validation is complete.
     */
    public validate(restAPIService: RestApiConnectorService): Observable<ValidationData> {
        return this.base_validate(restAPIService).pipe(
            map(result => {
                // presence of source-ref
                if (!this.source_ref) { result.errors.push({
                    "field": "source_ref",
                    "result": "error",
                    "message": "source object is not specified"
                })} else { result.successes.push({
                    "field": "source_ref",
                    "result": "error",
                    "message": "source object specified"
                })}
                //presence of target ref
                if (!this.target_ref) { result.errors.push({
                    "field": "target_ref",
                    "result": "error",
                    "message": "target object is not specified"
                })} else { result.successes.push({
                    "field": "target_ref",
                    "result": "error",
                    "message": "target object specified"
                })}
                // is this a valid sub-technique-of relationship?
                if (this.source_ref && this.target_ref && this.relationship_type == "subtechnique-of") {
                    if (!this.source_object.stix.hasOwnProperty("x_mitre_is_subtechnique") || !this.source_object.stix.x_mitre_is_subtechnique) {
                        result.errors.push({
                            "field": "source_ref",
                            "result": "error",
                            "message": "source is not a sub-technique"
                        })
                    }
                    if (this.target_object.stix.x_mitre_is_subtechnique) {
                        result.errors.push({
                            "field": "target_ref",
                            "result": "error",
                            "message": "target is a sub-technique"
                        })
                    }
                } 
                
                return result;
            }),
            //check for parallel relationships
            switchMap(result => {
                // find all objects connected to the source or target ref
                return restAPIService.getRelatedTo({sourceRef: this.source_ref, targetRef: this.target_ref}).pipe( 
                    map(objects => {
                        let relationships = objects.data as Relationship[];
                        if (relationships.find(relationship => { //parallel relationship
                            return relationship.stixID != this.stixID &&
                                   relationship.source_ref == this.source_ref &&
                                   relationship.target_ref == this.target_ref
                        })) {
                            result.errors.push({
                                "field": "source_ref",
                                "result": "error",
                                "message": "a relationship already exists between these objects"
                            })
                            
                        } else {
                            result.successes.push({
                                "field": "source_ref",
                                "result": "success",
                                "message": "relationship is unique"
                            })
                        }
                        return result;
                    })
                )
            }),
            switchMap(result => { // check for existing sub-technique-of for targeted technique
                if (this.relationship_type == "subtechnique-of") {
                    return restAPIService.getRelatedTo({sourceRef: this.source_ref, relationshipType: "subtechnique-of"}).pipe(
                        map(objects => {
                            if (objects.data.length > 0) { //already has a parent
                                result.errors.push({
                                    "field": "source_ref",
                                    "result": "error",
                                    "message": "sub-technique already has a parent"
                                })
                            }
                            return result;
                        })
                    )
                } else { return of(result); }
            })
        );
    }

    /**
     * Save the current state of the STIX object in the database. Update the current object from the response
     * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
     * @returns {Observable} of the post
     */
    public save(restAPIService: RestApiConnectorService): Observable<Relationship> {        
        let postObservable = restAPIService.postRelationship(this);
        let subscription = postObservable.subscribe({
            next: (result) => { this.deserialize(result.serialize()); },
            complete: () => { subscription.unsubscribe(); }
        });
        return postObservable;
        
    }

    /**
     * Delete this STIX object from the database.
     * @param restAPIService [RestApiConnectorService] the service to perform the DELETE through
     */
    public delete(restAPIService: RestApiConnectorService) : Observable<{}> {
        let deleteObservable = restAPIService.deleteRelationship(this.stixID, this.modified);
        let subscription = deleteObservable.subscribe({
            complete: () => { subscription.unsubscribe(); }
        });
        return deleteObservable;
    }
}
