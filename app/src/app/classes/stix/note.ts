import { Observable } from "rxjs";
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";
import { ValidationData } from "../serializable";
import { StixObject } from "./stix-object";

export class Note extends StixObject {
    public title: string = "";
    public content: string = "";
    public object_refs: string[] = [];
    public editing: boolean = false;

    protected get attackIDValidator() { return null; } // notes have no ATT&CK ID

    constructor(sdo?: any) {
        super(sdo, "note");
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
        if (this.title) rep.stix.abstract = this.title;
        rep.stix.content = this.content;
        rep.stix.object_refs = this.object_refs;
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

            if ("abstract" in sdo) {
                if (typeof(sdo.abstract) === "string") this.title = sdo.abstract;
                else console.error("TypeError: abstract field is not a string:", sdo.abstract, "(",typeof(sdo.abstract),")")
            } else this.title = "";

            if ("content" in sdo) {
                if (typeof(sdo.content) === "string") this.content = sdo.content;
                else console.error("TypeError: content field is not a string:", sdo.content, "(",typeof(sdo.content),")")
            } else this.content = "";

            if ("object_refs" in sdo) {
                if (this.isStringArray(sdo.object_refs)) this.object_refs = sdo.object_refs;
                else console.error("TypeError: object_refs field is not a string array.");
            } else this.object_refs = [];
        }
    }

    /**
     * Validate the current object state and return information on the result of the validation
     * @param {RestApiConnectorService} restAPIService: the REST API connector through which asynchronous validation can be completed
     * @returns {Observable<ValidationData>} the validation warnings and errors once validation is complete.
     */
    public validate(restAPIService: RestApiConnectorService): Observable<ValidationData> {
        return this.base_validate(restAPIService);
    }

    /**
     * Save the current state of the STIX object in the database. Update the current object from the response
     * @param new_version [boolean] if false, overwrite the current version of the object. If true, creates a new version.
     * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
     * @returns {Observable} of the post
     */
    public save(restAPIService: RestApiConnectorService): Observable<Note> {
        // TODO PUT if the object was just created (doesn't exist in db yet)
        
        let postObservable = restAPIService.postNote(this);
        let subscription = postObservable.subscribe({
            next: (result) => { this.deserialize(result); },
            complete: () => { subscription.unsubscribe(); }
        });
        return postObservable;
    }

    /**
     * Delete this STIX object from the database.
     * @param restAPIService [RestApiConnectorService] the service to perform the DELETE through
     */
    public delete(restAPIService: RestApiConnectorService) : void {
        let deleteObservable = restAPIService.deleteNote(this.stixID, this.modified);
        let subscription = deleteObservable.subscribe({
            complete: () => { subscription.unsubscribe(); }
        });
    }
}
