import { map, switchMap } from "rxjs/operators";
import { StixObject } from "./stix-object";
import { Relationship } from './relationship';
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";
import { Observable, of } from "rxjs";
import { ValidationData } from "../serializable";
import { logger } from "../../util/logger";

export class MarkingDefinition extends StixObject {
    public name: string = "";
    public definition_type: string = "statement"; // unless otherwise specified
    public definition_string: string = "";

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
        rep.stix.definition_type = this.definition_type;
        rep.stix.definition = {};
        rep.stix.definition[this.definition_type] = this.definition_string;

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

            if ("definition_type" in sdo) {
                if (typeof(sdo.definition_type) === "string") {
                    this.definition_type = sdo.definition_type;
                    if ("definition" in sdo) {
                        if (this.definition_type in sdo.definition) {
                            if (typeof(sdo.definition[this.definition_type]) == "string") 
                                this.definition_string = sdo.definition[this.definition_type];
                        }
                        else logger.error("TypeError: definition_type was not found in definition", sdo.definition_type, "(",(sdo.definition),")") 
                    }
                }
                else logger.error("TypeError: definition_type is not a string:", sdo.definition_type, "(",typeof(sdo.definition_type),")")
            } else {
                this.definition_type = "statement"; // type will be statement by default
                this.definition_string = ""; // requires definition type to get definition string
            }
        }
    }

    /**
     * Validate the current object state and return information on the result of the validation
     * @param {RestApiConnectorService} restAPIService: the REST API connector through which asynchronous validation can be completed
     * @returns {Observable<ValidationData>} the validation warnings and errors once validation is complete.
     */
    public validate(restAPIService: RestApiConnectorService): Observable<ValidationData> {
        return this.base_validate(restAPIService).pipe(
            map(result => {
                // presence of statement
                if (!this.definition_string) { result.errors.push({
                    "field": "definition_string",
                    "result": "error",
                    "message": "definition string is not specified"
                })} else { 
                    let successmsg = "definition string specified: " + this.definition_string;
                    result.successes.push({
                        "field": "definition_string",
                        "result": "success",
                        "message": successmsg
                    })
                }
                return result;
            }),
            switchMap(result => {
                // validate that the marking definition is unique
                return restAPIService.getAllMarkingDefinitions().pipe( 
                    map(objects => {
                        if (this.definition_string) {
                            for (let object of objects.data) {
                                if ("definition_string" in object) {
                                    if (object['definition_string'] == this.definition_string) {
                                        result.errors.push({
                                            "field": "definition_string",
                                            "result": "error",
                                            "message": "marking definition is not unique"
                                        })
                                    }
                                }
                            }
                        }
                        return result;
                    }
                ))
            })
        )
    }

    /**
     * Save the current state of the STIX object in the database. Update the current object from the response
     * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
     * @returns {Observable} of the post
     */
    public save(restAPIService: RestApiConnectorService): Observable<MarkingDefinition> {
        let postObservable = restAPIService.postMarkingDefinition(this);
        let subscription = postObservable.subscribe({
            next: (result) => { this.deserialize(result.serialize()); },
            complete: () => { subscription.unsubscribe(); }
        });
        return postObservable;
    }
}