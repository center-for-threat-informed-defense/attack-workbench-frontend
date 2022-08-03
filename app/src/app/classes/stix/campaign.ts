import { StixObject } from "./stix-object";
import { logger } from "../../util/logger";
import { Observable } from "rxjs";
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";
import { ValidationData } from "../serializable";

export class Campaign extends StixObject {
    public name: string = "";
    public first_seen: Date;
    public last_seen: Date;
    public aliases: string[] = ["placeholder"]; // initialize field with placeholder in first index for campaign name
    public contributors: string[] = [];

    public readonly supportsAttackID = true;
    public readonly supportsNamespace = true;
    protected get attackIDValidator() {
        return {
            regex: "C\\d{4}",
            format: "C####"
        }
    }

    constructor(sdo?: any) {
        super(sdo, "campaign");
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
        if (this.first_seen) rep.stix.first_seen = this.first_seen.toISOString();
        if (this.last_seen) rep.stix.last_seen = this.last_seen.toISOString();
        rep.stix.aliases = this.aliases.map(x => x.trim());
        rep.stix.x_mitre_contributors = this.contributors.map(x => x.trim());

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

            if ("first_seen" in sdo) {
                if (typeof (sdo.first_seen) === "string") this.first_seen = new Date(sdo.first_seen);
                else logger.error("TypeError: first_seen field is not a string:", sdo.first_seen, "(", typeof (sdo.first_seen), ")")
            }

            if ("last_seen" in sdo) {
                if (typeof (sdo.last_seen) === "string") this.last_seen = new Date(sdo.last_seen);
                else logger.error("TypeError: last_seen field is not a string:", sdo.last_seen, "(", typeof (sdo.last_seen), ")")
            }

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
    public save(restAPIService: RestApiConnectorService): Observable<Campaign> {
        // update first index of aliases field to campaign name
        this.aliases[0] = this.name;
        let postObservable = restAPIService.postCampaign(this);
        let subscription = postObservable.subscribe({
            next: (result) => { this.deserialize(result.serialize()); },
            complete: () => { subscription.unsubscribe(); }
        });
        return postObservable;
    }
}