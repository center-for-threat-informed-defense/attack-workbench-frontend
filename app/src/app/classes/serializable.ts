import { Observable } from "rxjs";
import { RestApiConnectorService } from "../services/connectors/rest-api/rest-api-connector.service";

/**
 * Objects which are serializable to the REST API implement this class
 */
export abstract class Serializable {
    /**
     *  Transform the current object into a raw object for sending to the back-end, stripping any unnecessary fields
     * @abstract
     * @returns {*} the raw object to send
     */
    public abstract serialize(): any;
    /**
     * Parse the object from the record returned from the back-end
     * @abstract
     * @param {*} raw the raw object to parse
     */
    public abstract deserialize(raw: any);

    /**
     * Validate the current object state and return information on the result of the validation
     * @abstract
     * @param {RestApiConnectorService} restAPIService: the REST API connector through which asynchronous validation can be completed
     * @returns {Observable<ValidationData>} the validation warnings and errors once validation is complete.
     */
    public abstract validate(restAPIService: RestApiConnectorService): Observable<ValidationData>;
}

export class ValidationData {
    public successes: ValidationFieldData[] = [];
    public warnings: ValidationFieldData[] = []; 
    public errors: ValidationFieldData[] = [];
}

export interface ValidationFieldData {
    result: "success" | "warning" | "error"; //validation result type
    displayOnSuccess?: boolean; //default true, if false, don't show this result to a user if it is a success (but do show if it is a failure or warning)
    field: string; //the field that was validated
    message: string; //the validation warning or error message to display to the user.
}