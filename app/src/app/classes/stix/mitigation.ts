import { Observable } from "rxjs";
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";
import { ValidationData } from "../serializable";
import {StixObject} from "./stix-object";
import { logger } from "../../utils/logger";

export class Mitigation extends StixObject {
    public name: string = "";
    public domains: string[] = [];
    public securityControls: string[] = [];

    public readonly supportsAttackID = true;
    public readonly supportsNamespace = true;
    protected get attackIDValidator() { return {
        regex: "M\\d{4}",
        format: "M####"
    }}

    constructor(sdo?: any) {
        super(sdo, "course-of-action");
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

        rep.stix.name = this.name.trim();
        rep.stix.x_mitre_domains = this.domains;

        // domain specific fields
        if (this.domains.includes('ics-attack') && this.securityControls.length > 0) {
            rep.stix.labels = this.securityControls;
        }

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
                else logger.error("TypeError: name field is not a string:", sdo.name, "(",typeof(sdo.name),")")
            } else this.name = "";

            if ("x_mitre_domains" in sdo) {
                if (this.isStringArray(sdo.x_mitre_domains)) this.domains = sdo.x_mitre_domains;
                else logger.error("TypeError: domains field is not a string array.");
            } else this.domains = [];

            if ("labels" in sdo) {
                if (this.isStringArray(sdo.labels)) this.securityControls = sdo.labels;
                else logger.error("TypeError: labels field is not a string array.");
            } else this.securityControls = [];
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
     * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
     * @returns {Observable} of the post
     */
    public save(restAPIService: RestApiConnectorService) : Observable<Mitigation> {
        let postObservable = restAPIService.postMitigation(this);
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
        let deleteObservable = restAPIService.deleteMitigation(this.stixID);
        let subscription = deleteObservable.subscribe({
            complete: () => { subscription.unsubscribe(); }
        });
        return deleteObservable;
    }

    /**
     * Update the state of the STIX object in the database.
     * @param restAPIService [RestApiConnectorService] the service to perform the PUT through
     * @returns {Observable} of the put
     */
    public update(restAPIService: RestApiConnectorService) : Observable<Mitigation> {
        let putObservable = restAPIService.putMitigation(this);
        let subscription = putObservable.subscribe({
            complete: () => { subscription.unsubscribe(); }
        });
        return putObservable;
    }

    
}
