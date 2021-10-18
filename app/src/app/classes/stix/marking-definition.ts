import {StixObject} from "./stix-object";
import { Relationship } from './relationship';
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";
import { Observable, of } from "rxjs";
import { ValidationData } from "../serializable";
import { logger } from "../../util/logger";

export class MarkingDefinition extends StixObject {
    public name: string = "";
    public definition_type: string = ""
    public definition: {
        statement: string
    } = { statement: "" }

    public readonly supportsAttackID = false; // marking-defs do not support ATT&CK IDs
    protected get attackIDValidator() { return null; } //marking-defs do not have ATT&CK IDs

    constructor(sdo?: any) {
        super(sdo, "marking-definition");
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
        rep.stix.definition_type = this.definition_type
        rep.stix.definition = this.definition;

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
            
            // TODO improve this with better checking
            if ("definition" in sdo) {
                this.definition = sdo.definition;
            }

            if ("definition_type" in sdo) {
                if (typeof(sdo.definition_type) === "string") this.definition_type = sdo.definition_type;
                else logger.error("TypeError: definition_type is not a string:", sdo.definition_type, "(",typeof(sdo.definition_type),")")
            } else this.definition_type = "";
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
    public save(restAPIService: RestApiConnectorService): Observable<MarkingDefinition> {
        // TODO 
        return of(this);
    }
}