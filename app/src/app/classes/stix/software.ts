import { Observable } from "rxjs";
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";
import { ValidationData } from "../serializable";
import {StixObject} from "./stix-object";

type type_software = "malware" | "tool"
export class Software extends StixObject {
    public name: string = "";
    public description: string;
    public aliases: string[] = [];
    public platforms: string[] = [];
    public type: string;
    public contributors: string[] = [];
    public domains: string[] = [];
    
    protected get attackIDValidator() { return {
        regex: "S\\d{4}",
        format: "S####"
    }}

    constructor(type: type_software, sdo?: any) {
        super(sdo, type);
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
        rep.stix.type = this.type;
        rep.stix.x_mitre_domains = this.domains;
        rep.stix.x_mitre_aliases = this.aliases;
        rep.stix.x_mitre_platforms = this.platforms;
        rep.stix.x_mitre_contributors = this.contributors;
        if (this.type == "malware") rep.stix.is_family = true; // add is_family to malware type SDOs

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

            if ("type" in sdo) {
                if (typeof(sdo.type) === "string") this.type = sdo.type;
                else console.error("TypeError: type field is not a string:", sdo.type, "(",typeof(sdo.type),")")
            } else this.type = "";

            if ("x_mitre_aliases" in sdo) {
                if (this.isStringArray(sdo.x_mitre_aliases)) this.aliases = sdo.x_mitre_aliases;
                else console.error("TypeError: aliases is not a string array:", sdo.x_mitre_aliases, "(",typeof(sdo.x_mitre_aliases),")")
            } else this.aliases = [];

            if ("x_mitre_domains" in sdo) {
                if (this.isStringArray(sdo.x_mitre_domains)) this.domains = sdo.x_mitre_domains;
                else console.error("TypeError: domains field is not a string array.");
            } else this.domains = [];

            if ("x_mitre_platforms" in sdo) {
                if (this.isStringArray(sdo.x_mitre_platforms)) this.platforms = sdo.x_mitre_platforms;
                else console.error("TypeError: x_mitre_platforms is not a string array:", sdo.x_mitre_platforms, "(",typeof(sdo.x_mitre_platforms),")")
            } else this.platforms = [];

            if ("x_mitre_contributors" in sdo) {
                if (this.isStringArray(sdo.x_mitre_contributors)) this.contributors = sdo.x_mitre_contributors;
                else console.error("TypeError: x_mitre_contributors is not a string array:", sdo.x_mitre_contributors, "(",typeof(sdo.x_mitre_contributors),")")
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
    public save(restAPIService: RestApiConnectorService): Observable<Software> {
        // TODO POST if the object was just created (doesn't exist in db yet)
        
        let postObservable = restAPIService.postSoftware(this);
        let subscription = postObservable.subscribe({
            next: (result) => { this.deserialize(result.serialize()); },
            complete: () => { subscription.unsubscribe(); }
        });
        return postObservable;
    }
}