import { Observable } from "rxjs";
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";
import { ValidationData } from "../serializable";
import {StixObject} from "./stix-object";

export class Relationship extends StixObject {

    public readonly source_ref: string;
    public get source_name(): string { return this.source_object? this.source_object.stix.name : "[unknown object]"; }
    public source_ID: string;
    public source_object: any;
    

    public readonly target_ref: string;
    public get target_name(): string { return this.target_object? this.target_object.stix.name : "[unknown object]"; }
    public target_ID: string;
    public target_object: any;
    
    
    public readonly relationship_type: string;
    /**
     * The valid source types according to relationship_type
     * null if any type is valid or relationship_type is not recognized
     */
    public get valid_source_types(): string[] {
        if (this.relationship_type == "uses") return ["group", "software"]
        if (this.relationship_type == "mitigates") return ["mitigation"]
        if (this.relationship_type == "subtechnique-of") return ["technique"]
        else return null;
    }
    /**
     * The valid source types according to relationship_type
     * null if any type is valid or relationship_type is not recognized
     */
    public get valid_target_types(): string[] {
        if (this.relationship_type == "uses") return ["software", "technique"]
        if (this.relationship_type == "mitigates") return ["technique"]
        if (this.relationship_type == "subtechnique-of") return ["technique"]
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
                if (src_sdo.external_references.length > 0) {
                    if (typeof(src_sdo.external_references[0].external_id) === "string") this.source_ID = src_sdo.external_references[0].external_id;
                    else console.error("TypeError: attackID field is not a string:", src_sdo.external_references[0].external_id, "(", typeof(src_sdo.external_references[0].external_id), ")");
                }
                else console.error("ObjectError: external references is empty");
            } else this.source_ID = "";
        }
        if ("target_object" in raw) {
            this.target_object = raw.target_object;
            // this.target_name = raw.target_object.stix.name;

            let tgt_sdo = raw.target_object.stix;
            if ("external_references" in tgt_sdo) {
                if (tgt_sdo.external_references.length > 0) {
                    if (typeof(tgt_sdo.external_references[0].external_id) === "string") this.target_ID = tgt_sdo.external_references[0].external_id;
                    else console.error("TypeError: attackID field is not a string:", tgt_sdo.external_references[0].external_id, "(", typeof(tgt_sdo.external_references[0].external_id), ")");
                }
                else console.error("ObjectError: external references is empty");
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
        return this.base_validate(restAPIService);
    }

    /**
     * Save the current state of the STIX object in the database. Update the current object from the response
     * @param new_version [boolean] if false, overwrite the current version of the object. If true, creates a new version.
     * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
     * @returns {Observable} of the post
     */
    public save(new_version: boolean = true, restAPIService: RestApiConnectorService): Observable<Relationship> {
        // TODO POST if the object was just created (doesn't exist in db yet)
        if (new_version) this.modified = new Date();
        
        let postObservable = restAPIService.postRelationship(this);
        let subscription = postObservable.subscribe({
            next: (result) => { this.deserialize(result); },
            complete: () => { subscription.unsubscribe(); }
        });
        return postObservable;
        
    }
}
