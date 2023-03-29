import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RestApiConnectorService } from '../../services/connectors/rest-api/rest-api-connector.service';
import { logger } from '../../util/logger';
import { Serializable, ValidationData } from '../serializable';
import { UserAccount } from './user-account';

export class Team extends Serializable {
    public id: string;
    public name: string;
    public description: string;
    public users: string[];
    public created: Date;
    public modified: Date;

    /**
     * Initialize user account object
     */
     constructor(raw?: any) {
        super();
        if (raw) { this.deserialize(raw); }
    }

    /**
     * Transform the current object into a raw object for sending to the back-end
     * @abstract
     * @returns {*} the raw object to send
     */
    public serialize(): any {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            users: this.users,
            created: this.created.toISOString(),
            modified: this.modified.toISOString()
        };
    }

    /**
     * Parse the object from the record returned from the back-end
     * @abstract
     * @param {*} raw the raw object to parse
     */
    public deserialize(raw: any) {
        if ('id' in raw) {
            if (typeof(raw.id) === 'string') { this.id = raw.id; }
            else { logger.error('TypeError: id field is not a string:', raw.name, '(', typeof(raw.name), ')'); }
        } else { this.id = ''; }

        if ('name' in raw && raw.name !== null) {
            if (typeof(raw.name) === 'string') { this.name = raw.name; }
            else { logger.error('TypeError: name field is not a string:', raw.name, '(', typeof(raw.name), ')'); }
        } else { this.name = ''; }

        if ('description' in raw) {
            if (typeof(raw.description) === 'string') { this.description = raw.description; }
            else { logger.error('TypeError: description field is not a string:', raw.description, '(', typeof(raw.description), ')'); }
        } else { this.description = ''; }

        if ('users' in raw && raw.users) {
            if (Array.isArray(raw.users)) { this.users = raw.users; }
            else { logger.error('TypeError: users field is not an array:', raw.users, '(', typeof(raw.users), ')'); }
        }

        if ('created' in raw) {
            if (typeof (raw.created) === "string") this.created = new Date(raw.created);
            else logger.error("TypeError: created field is not a string:", raw.created, "(", typeof (raw.created), ")")
        } else { this.created = new Date(); }

        if ('modified' in raw) {
            if (typeof (raw.modified) === "string") this.modified = new Date(raw.modified);
            else logger.error("TypeError: modified field is not a string:", raw.modified, "(", typeof (raw.modified), ")")
        } else { this.modified = new Date(); }
    }

    /**
     * Validate the current object state and return information on the result of the validation
     * @param {RestApiConnectorService} restAPIService: the REST API connector through which asynchronous validation can be completed
     * @returns {Observable<ValidationData>} the validation warnings and errors once validation is complete.
     */
    public validate(restAPIService: RestApiConnectorService): Observable<ValidationData> {
        const validation = new ValidationData();
        const obs = new Observable<ValidationData>();
        return obs;
    }

    /**
     * Save the current state of the STIX object in the database. Update the current object from the response
     * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
     * @returns {Observable} of the post
     */
     public save(restAPIService: RestApiConnectorService): Team {
        const putObservable = restAPIService.putTeam(this);
        return putObservable;
    }
}
