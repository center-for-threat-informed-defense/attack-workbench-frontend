import { Observable } from "rxjs";
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";
import {StixObject} from "./stix-object";

export class Relationship extends StixObject {

    public readonly source_ref: string;
    public source_name: string = "[unknown object]";

    public readonly target_ref: string;
    public target_name: string = "[unknown object]";
    
    public readonly relationship_type: string;
    public description: string;

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
        let rep: {[k: string]: any } = {};
        rep.workspace = {domains: ["test"]};

        rep.stix = super.base_serialize();
        rep.stix.description = this.description;
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
        if ("stix" in raw) {
            let sdo = raw.stix;

            if ("description" in sdo) {
                if (typeof(sdo.description) === "string") this.description = sdo.description;
                else console.error("TypeError: description field is not a string:", sdo.description, "(",typeof(sdo.description),")")
            } else this.description = "";

        }
        if ("source_object" in raw) { this.source_name = raw.source_object.stix.name; }
        if ("target_object" in raw) { this.target_name = raw.target_object.stix.name; }
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
