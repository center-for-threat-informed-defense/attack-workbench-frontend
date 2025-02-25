import { Observable, of } from "rxjs";
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";
import { ValidationData } from "../serializable";
import { StixObject } from "./stix-object";
import { logger } from "../../utils/logger";

export class Identity extends StixObject {
    public name: string; // identity name
    public identity_class: string; // type of entity this identity describes
    public roles?: string[]; // list of roles this identity performs
    public contact?: string; // contact information for this identity

    public readonly supportsAttackID = false; // Identity does not support ATT&CK IDs
    public readonly supportsNamespace = false;
    protected get attackIDValidator() { return null; } // identities do not have an ATT&CK ID

    constructor(sdo?: any) {
        super(sdo, "identity");
        if (sdo) { this.deserialize(sdo); }
    }

    /**
     * Transform the current object into a raw object for sending to the back-end, stripping any unnecessary fields
     * @abstract
     * @returns {*} the raw object to send
     */
    public serialize(): any {
        let rep = super.base_serialize();

        rep.stix.name = this.name;
        rep.stix.identity_class = this.identity_class;
        if (this.roles) rep.stix.roles = this.roles;
        if (this.contact) rep.stix.contact_information = this.contact;

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
                else logger.error("TypeError: name field is not a string:", sdo.name, "(" , typeof(sdo.name), ")");
            } else this.name = "";

            if ("identity_class" in sdo) {
                if (typeof(sdo.identity_class) === "string") this.identity_class = sdo.identity_class;
                else logger.error("TypeError: identity_class field is not a string:", sdo.identity_class, "(" , typeof(sdo.identity_class), ")");
            } else this.identity_class = "";

            if ("roles" in sdo) {
                if (this.isStringArray(sdo.roles)) this.roles = sdo.roles;
                else logger.error("TypeError: roles field is not a string array.");
            }

            if ("contact_information" in sdo) {
                if (typeof(sdo.contact_information) === "string") this.contact = sdo.contact_information;
                else logger.error("TypeError: contact_information field is not a string:", sdo.contact_information, "(", typeof(sdo.contact_information), ")");
            }
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
    public save(restAPIService: RestApiConnectorService) : Observable<Identity> {
        let postObservable = restAPIService.postIdentity(this);
        let subscription = postObservable.subscribe({
            next: (result) => { this.deserialize(result); },
            complete: () => { subscription.unsubscribe(); }
        });
        return postObservable;
    }

    public delete(_restAPIService: RestApiConnectorService): Observable<{}> {
        // deletion is not supported on Identity objects
        return of({});
    }

    /**
     * Update the state of the STIX object in the database.
     * @param restAPIService [RestApiConnectorService] the service to perform the PUT through
     * @returns {Observable} of the put
     */
    public update(restAPIService: RestApiConnectorService) : Observable<Identity> {
        let putObservable = restAPIService.putIdentity(this);
        let subscription = putObservable.subscribe({
            complete: () => { subscription.unsubscribe(); }
        });
        return putObservable;
    }
}
