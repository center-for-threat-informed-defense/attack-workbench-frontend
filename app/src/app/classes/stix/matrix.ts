import { Observable } from "rxjs";
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";
import {StixObject} from "./stix-object";

export class Matrix extends StixObject {
    public name: string;
    public tactic_refs: string[];

    constructor(sdo?: any) {
        super(sdo, "x-mitre-matrix");
        if (sdo) {
            this.deserialize(sdo);
        }
    }

    /**
     * Transform the current object into a raw object for sending to the back-end, stripping any unnecessary fields
     * @abstract
     * @returns {*} the raw object to send
     */
    public serialize(): any {
        let rep = super.base_serialize();

        rep.stix.name = this.name;
        rep.stix.tactic_refs = this.tactic_refs;

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

            if ("name" in sdo) {
                if (typeof(sdo.name) === "string") this.name = sdo.name;
                else console.error("TypeError: name field is not a string:", sdo.name, "(",typeof(sdo.name),")")
            } else this.name = "";
            
            if ("tactic_refs" in sdo) {
                if (this.isStringArray(sdo.tactic_refs)) this.tactic_refs = sdo.tactic_refs;
                else console.error("TypeError: tactic_refs field is not a string array:", sdo.tactic_refs, "(",typeof(sdo.tactic_refs),")")
            } else this.tactic_refs = [];
        }
    }

    /**
     * Save the current state of the STIX object in the database. Update the current object from the response
     * @param new_version [boolean] if false, overwrite the current version of the object. If true, creates a new version.
     * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
     * @returns {Observable} of the post
     */
    public save(new_version: boolean = true, restAPIService: RestApiConnectorService): Observable<Matrix> {
        // TODO PUT if the object was just created (doesn't exist in db yet)
        if (new_version) this.modified = new Date();
        
        let postObservable = restAPIService.postMatrix(this);
        let subscription = postObservable.subscribe({
            next: (result) => { this.deserialize(result); },
            complete: () => { subscription.unsubscribe(); }
        });
        return postObservable;
    }
}
