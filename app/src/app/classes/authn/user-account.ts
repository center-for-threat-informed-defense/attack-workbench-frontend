import { Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { RestApiConnectorService } from "../../services/connectors/rest-api/rest-api-connector.service";
import { logger } from "../../util/logger";
import { Serializable, ValidationData } from "../serializable";
import { Role } from "./role";

export type statusValues = "pending" | "active" | "inactive";

export class UserAccount extends Serializable {
    public id: string;
    public email: string;
    public username: string;
    public status: statusValues;
    public role: Role;

    /**
     * Initialize user account object
     */
     constructor(raw?: any) {
        super();
        if (raw) this.deserialize(raw);
    }

    /**
     * Transform the current object into a raw object for sending to the back-end
     * @abstract
     * @returns {*} the raw object to send
     */
    public serialize(): any {
        return {
            "id": this.id,
            "email": this.email,
            "username": this.username,
            "status": this.status,
            "role": this.role
        }
    }

    /**
     * Parse the object from the record returned from the back-end
     * @abstract
     * @param {*} raw the raw object to parse
     */
    public deserialize(raw: any) {
        if ("id" in raw) {
            if (typeof(raw.id) === "string") this.id = raw.id;
            else logger.error("TypeError: id field is not a string:", raw.name, "(",typeof(raw.name),")");
        } else this.id = "";

        if ("email" in raw && raw.email !== null) {
            if (typeof(raw.email) === "string") this.email = raw.email;
            else logger.error("TypeError: email field is not a string:", raw.email, "(",typeof(raw.email),")");
        } else this.email = "";

        if ("username" in raw) {
            if (typeof(raw.username) === "string") this.username = raw.username;
            else logger.error("TypeError: username field is not a string:", raw.username, "(",typeof(raw.username),")");
        } else this.username = "";

        if ("status" in raw) {
            if (typeof(raw.status) === "string") this.status = raw.status;
            else logger.error("TypeError: status field is not a string:", raw.status, "(",typeof(raw.status),")");
        } else this.status = "pending";

        if ("role" in raw) {
            if (typeof(raw.role) === "string") this.role = raw.role;
            else logger.error("TypeError: role field is not a string:", raw.role, "(",typeof(raw.role),")");
        } else this.role = Role.None;
    }

    /**
     * Validate the current object state and return information on the result of the validation
     * @param {RestApiConnectorService} restAPIService: the REST API connector through which asynchronous validation can be completed
     * @returns {Observable<ValidationData>} the validation warnings and errors once validation is complete.
     */
    public validate(restAPIService: RestApiConnectorService): Observable<ValidationData> {
        let validation = new ValidationData();
        return;

        // TODO check any asynchronous validators
        // return of(validation).pipe(
        //     // check if the username is unique
        //     switchMap(result => {
        //         return restAPIService.getAllUserAccounts().pipe(
        //             map(userAccounts -> {
        //                 if (this.hasOwnProperty("username")) {
        //                     if (this["username"] == "") {
        //                         result.errors.push({
        //                             "result": "error",
        //                             "field": "username",
        //                             "message": "object has no username"
        //                         })
        //                     }
        //                 }
        //                 return result
        //             })
        //         )
        //     })
        // );
    }

    /**
     * Save the current state of the STIX object in the database. Update the current object from the response
     * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
     * @returns {Observable} of the post
     */
     public save(restAPIService: RestApiConnectorService): Observable<UserAccount> {
        // TODO PUT if the object was just created (doesn't exist in db yet)
        
        let postObservable = restAPIService.postUserAccount(this);
        let subscription = postObservable.subscribe({
            next: (result) => { this.deserialize(result.serialize()); },
            complete: () => { subscription.unsubscribe(); }
        });
        return postObservable;
    }
}