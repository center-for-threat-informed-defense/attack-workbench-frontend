import { Observable } from "rxjs";
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";
import { ValidationData } from "../serializable";
import { StixObject } from "./stix-object";
import { logger } from "../../util/logger";
import { DataSource } from "./data-source";

export class DataComponent extends StixObject {
    public name: string = "";
    public description: string = "";
    public domains: string[] = ['enterprise-attack']; // default to enterprise
    public data_source_ref: string; // stix ID of the data source

    // NOTE: the following field will only be populated when this object is fetched using getDataComponent()
    public data_source: DataSource = null;

    public readonly supportsAttackID = false; // data components do not support ATT&CK IDs
    public readonly supportsNamespace = false;
    protected get attackIDValidator() { return null; } // data components have no ATT&CK ID

    constructor(sdo?: any) {
        super(sdo, "x-mitre-data-component");
        if (sdo) {
            this.deserialize(sdo);
        }
    }

    /**
     * Transform the current object into a raw object for sending to the back-end
     * @abstract
     * @returns {*} the raw object to send
     */
    public serialize(): any {
        let rep = super.base_serialize();

        rep.stix.name = this.name;
        rep.stix.description = this.description;
        rep.stix.x_mitre_data_source_ref = this.data_source_ref;
        rep.stix.x_mitre_domains = this.domains;
        
        return rep;
    }

    /**
     * Parse the object from the record returned from the back-end
     * @abstract
     * @param {*} raw the raw object to parse
     */
    public deserialize(raw: any) {
        if (!("stix" in raw)) return;

        let sdo = raw.stix;

        if ("name" in sdo) {
            if (typeof(sdo.name) === "string") this.name = sdo.name;
            else logger.error("TypeError: name field is not a string:", sdo.name, "(",typeof(sdo.name),")")
        } else this.name = "";

        if ("description" in sdo) {
            if (typeof(sdo.description) === "string") this.description = sdo.description;
            else logger.error("TypeError: description field is not a string:", sdo.description, "(",typeof(sdo.description),")")
        } else this.description = "";

        if ("x_mitre_data_source_ref" in sdo) {
            if (typeof(sdo.x_mitre_data_source_ref) === "string") this.data_source_ref = sdo.x_mitre_data_source_ref;
            else logger.error("TypeError: data source ref field is not a string:", sdo.x_mitre_data_source_ref, "(",typeof(sdo.x_mitre_data_source_ref),")")
        } else this.data_source_ref = "";

        if ("x_mitre_domains" in sdo) {
            if (this.isStringArray(sdo.x_mitre_domains)) this.domains = sdo.x_mitre_domains;
            else logger.error("TypeError: domains field is not a string array.");
        } else this.domains = ['enterprise-attack']; // default to enterprise
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
    public save(restAPIService: RestApiConnectorService): Observable<DataComponent> {
        // TODO POST if the object was just created (doesn't exist in db yet)
                
        let postObservable = restAPIService.postDataComponent(this);
        let subscription = postObservable.subscribe({
            next: (result) => { this.deserialize(result.serialize()); },
            complete: () => { subscription.unsubscribe(); }
        });
        return postObservable;
    }
}