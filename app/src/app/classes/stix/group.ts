import { StixObject } from "./stix-object";
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";
import { Observable } from "rxjs";
import { ValidationData } from "../serializable";
import { logger } from "../../util/logger";

export class Group extends StixObject {
    public name: string = "";
    public aliases: string[] = [];
    public contributors: string[] = [];

    public readonly supportsAttackID = true;
    public readonly supportsNamespace = true;
    protected get attackIDValidator() { return {
        regex: "G\\d{4}",
        format: "G####"
    }}

    constructor(sdo?: any) {
        super(sdo, "intrusion-set");
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
        rep.stix.aliases = this.aliases;
        rep.stix.x_mitre_contributors = this.contributors;

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

            if ("aliases" in sdo) {
                if (this.isStringArray(sdo.aliases)) this.aliases = sdo.aliases;
                else logger.error("TypeError: aliases is not a string array:", sdo.aliases, "(",typeof(sdo.aliases),")")
            } else this.aliases = [];

            if ("x_mitre_contributors" in sdo) {
                if (this.isStringArray(sdo.x_mitre_contributors)) this.contributors = sdo.x_mitre_contributors;
                else logger.error("TypeError: x_mitre_contributors is not a string array:", sdo.x_mitre_contributors, "(",typeof(sdo.x_mitre_contributors),")")
            } else this.contributors = [];
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
    public save(restAPIService: RestApiConnectorService): Observable<Group> {
        // TODO PUT if the object was just created (doesn't exist in db yet)

        let postObservable = restAPIService.postGroup(this);
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
    public delete(restAPIService: RestApiConnectorService) : void {
        let deleteObservable = restAPIService.deleteGroup(this.stixID, this.modified);
        let subscription = deleteObservable.subscribe({
            complete: () => { subscription.unsubscribe(); }
        });
    }
}
