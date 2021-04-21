import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";
import { ValidationData } from "../serializable";
import {StixObject} from "./stix-object";

export class Relationship extends StixObject {

    public source_ref: string;
    public get source_name(): string { return this.source_object? this.source_object.stix.name : "[unknown object]"; }
    public source_ID: string;
    public source_object: any;
    

    public target_ref: string;
    public get target_name(): string { return this.target_object? this.target_object.stix.name : "[unknown object]"; }
    public target_ID: string;
    public target_object: any;
    
    public updating_refs: boolean = false; //becomes true while source and target refs are being asynchronously updated.
    
    public relationship_type: string;

    protected get attackIDValidator() { return null; } // relationships have no ATT&CK ID
    /**
     * The valid source types according to relationship_type
     * null if any type is valid or relationship_type is not recognized
     */
    public get valid_source_types(): string[] {
        if (this.relationship_type == "uses") {
            if (this.target_object && (this.target_object.stix.type == "malware" || this.target_object.stix.type == "tool")) return ["group"];
            else return ["software", "group"];
        }
        if (this.relationship_type == "mitigates") return ["mitigation"];
        if (this.relationship_type == "subtechnique-of") return ["technique"];
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
        else return null;
    }

    constructor(sdo?: any) {
        super(sdo, "relationship");
        if (sdo) {
            if ("stix" in sdo) {
                let sdoStix = sdo.stix;

                // Initialize read only values in constructor
                if ("source_ref" in sdoStix) {
                    if (typeof(sdoStix.source_ref) === "string") this.source_ref = sdoStix.source_ref;
                    else console.error("TypeError: source_ref field is not a string:", sdoStix.source_ref, "(",typeof(sdoStix.source_ref),")")
                }
                if ("target_ref" in sdoStix) {
                    if (typeof(sdoStix.target_ref) === "string") this.target_ref = sdoStix.target_ref;
                    else console.error("TypeError: target_ref field is not a string:", sdoStix.target_ref, "(",typeof(sdoStix.target_ref),")")
                }
                if ("relationship_type" in sdoStix) {
                    if (typeof(sdoStix.relationship_type) === "string") this.relationship_type = sdoStix.relationship_type;
                    else console.error("TypeError: relationship_type field is not a string:", sdoStix.relationship_type, "(",typeof(sdoStix.relationship_type),")")
                }
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
                this.updating_refs = false;
                return this;
            })
        )
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
        if ("source_object" in raw) {
            this.source_object = raw.source_object;
            // this.source_name = raw.source_object.stix.name;
            
            let src_sdo = raw.source_object.stix;
            if ("external_references" in src_sdo) {
                if (src_sdo.external_references.length > 0 && src_sdo.external_references[0].hasOwnProperty("external_id")) {
                    if (typeof(src_sdo.external_references[0].external_id) === "string") this.source_ID = src_sdo.external_references[0].external_id;
                    else console.error("TypeError: attackID field is not a string:", src_sdo.external_references[0].external_id, "(", typeof(src_sdo.external_references[0].external_id), ")");
                }
                else console.warn("ObjectWarning: cannot find attackID for source object");
            } else this.source_ID = "";
        }
        if ("target_object" in raw) {
            this.target_object = raw.target_object;
            // this.target_name = raw.target_object.stix.name;

            let tgt_sdo = raw.target_object.stix;
            if ("external_references" in tgt_sdo) {
                if (tgt_sdo.external_references.length > 0 && tgt_sdo.external_references[0].hasOwnProperty("external_id")) {
                    if (typeof(tgt_sdo.external_references[0].external_id) === "string") this.target_ID = tgt_sdo.external_references[0].external_id;
                    else console.error("TypeError: attackID field is not a string:", tgt_sdo.external_references[0].external_id, "(", typeof(tgt_sdo.external_references[0].external_id), ")");
                }
                else console.warn("ObjectWarning: cannot find attackID for target object");
            } else this.target_ID = "";
        }
    }

    /**
     * Validate the current object state and return information on the result of the validation
     * @param {RestApiConnectorService} restAPIService: the REST API connector through which asynchronous validation can be completed
     * @returns {Observable<ValidationData>} the validation warnings and errors once validation is complete.
     */
    public validate(restAPIService: RestApiConnectorService): Observable<ValidationData> {
        //TODO verify source and target ref exist
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
                    if (!this.source_object.stix.hasOwnProperty("x_mitre_is_subtechnique") || this.source_object.stix.x_mitre_is_subtechnique == false) {
                        result.errors.push({
                            "field": "source_ref",
                            "result": "error",
                            "message": "source is not a sub-technique"
                        })
                    }
                    if (this.target_object.stix.x_mitre_is_subtechnique == true) {
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
                // TODO replace with getAllRelationships once the API is fixed
                return restAPIService.getAllObjects().pipe(
                    map(objects => {
                        let relationships = objects as any[];
                        if (relationships.find(relationship => { //parallel relationship
                            return relationship.stix.type == "relationship" &&
                                   relationship.stix.id != this.stixID && 
                                   relationship.stix.source_ref == this.source_ref &&
                                   relationship.stix.target_ref == this.target_ref
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
                        // ensure that sub-techniques can't have multiple parent techniques
                        if (this.relationship_type == "subtechnique-of" && relationships.find(relationship => {
                            return relationship.stix.type == "relationship" && //relationship
                                   relationship.stix.id != this.stixID &&  //not the same as the one being saved
                                   relationship.stix.relationship_type == "subtechnique-of" && // involves sub-techniques
                                   relationship.stix.source_ref == this.source_ref // involves the same sub-technique as the one for this relationship
                        })) {
                            result.errors.push({
                                "field": "source_ref",
                                "result": "error",
                                "message": "sub-technique already has a parent"
                            })
                        }

                        return result;
                    })
                )
            })
        );
    }

    /**
     * Save the current state of the STIX object in the database. Update the current object from the response
     * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
     * @returns {Observable} of the post
     */
    public save(restAPIService: RestApiConnectorService): Observable<Relationship> {
        // TODO POST if the object was just created (doesn't exist in db yet)
        
        let postObservable = restAPIService.postRelationship(this);
        let subscription = postObservable.subscribe({
            next: (result) => { this.deserialize(result.serialize()); },
            complete: () => { subscription.unsubscribe(); }
        });
        return postObservable;
        
    }
}
