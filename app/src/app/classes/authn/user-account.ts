import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RestApiConnectorService } from '../../services/connectors/rest-api/rest-api-connector.service';
import { logger } from '../../util/logger';
import { Serializable, ValidationData } from '../serializable';
import { Role } from './role';
import { Status } from './status';

export class UserAccount extends Serializable {
    public id: string;
    public email: string;
    public username: string;
    private _displayName: string;
    public get displayName(): string { return this._displayName ? this._displayName : this.username }
    public set displayName(input: string) { this._displayName = input.trim(); }
    public status: Status;
    public role: Role;
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
            email: this.email,
            username: this.username,
            displayName: this._displayName,
            status: this.status,
            role: this.role,
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
        if (!('id' in raw)) this.id = '';
        else if (typeof(raw.id) === 'string') this.id = raw.id;
        else logger.error(`TypeError: id field is not a string: ${raw.id} (${typeof(raw.id)})`);

        if ('email' in raw && raw.email !== null) {
            if (typeof(raw.email) === 'string') { this.email = raw.email; }
            else { logger.error('TypeError: email field is not a string:', raw.email, '(', typeof(raw.email), ')'); }
        } else { this.email = ''; }

        if (!('username' in raw)) this.username = '';
        else if (typeof(raw.username) === 'string') this.username = raw.username;
        else logger.error(`TypeError: username field is not a string: ${raw.username} (${typeof(raw.username)})`);

        if ('displayName' in raw && raw.displayName) {
            if (typeof(raw.displayName) === 'string') { this._displayName = raw.displayName; }
            else { logger.error('TypeError: displayName field is not a string:', raw.displayName, '(', typeof(raw.displayName), ')'); }
        }

        if (!('status' in raw)) this.status = Status.PENDING;
        else if (typeof(raw.status) === 'string') this.status = raw.status;
        else logger.error(`TypeError: status field is not a string: ${raw.status} (${typeof(raw.status)})`);

        if (!('role' in raw)) this.role = Role.NONE;
        else if (typeof(raw.role) === 'string') this.role = raw.role;
        else logger.error(`TypeError: role field is not a string: ${raw.role} (${typeof(raw.role)})`);

        if (!('created' in raw)) this.created = new Date();
        else if (typeof(raw.created) === 'string') this.created = new Date(raw.created);
        else logger.error(`TypeError: created field is not a string: ${raw.created} (${typeof(raw.created)})`);

        if (!('modified' in raw)) this.modified = new Date();
        else if (typeof(raw.modified) === 'string') this.modified = new Date(raw.modified);
        else logger.error(`TypeError: modified field is not a string: ${raw.modified} (${typeof(raw.modified)})`);
    }

    /**
     * Validate the current object state and return information on the result of the validation
     * @param {RestApiConnectorService} restAPIService: the REST API connector through which asynchronous validation can be completed
     * @returns {Observable<ValidationData>} the validation warnings and errors once validation is complete.
     */
    public validate(restAPIService: RestApiConnectorService): Observable<ValidationData> {
        const validation = new ValidationData();

        return of(validation).pipe(
            // check if username is unique
            switchMap(result => {
                return restAPIService.getAllUserAccounts().pipe(
                    map(users => {
                        if (this.hasOwnProperty('username')) {
                            if (this.username == '') {
                                result.errors.push({
                                    result: 'error',
                                    field: 'username',
                                    message: 'user has no username'
                                });
                            } else if (users.data.some(x => x.username.toLowerCase() == this.username.toLowerCase() && x.id != this.id)) {
                                result.errors.push({
                                    result: 'error',
                                    field: 'username',
                                    message: 'username is not unique'
                                });
                            } else {
                                result.successes.push({
                                    result: 'success',
                                    field: 'username',
                                    message: 'username is unique'
                                });
                            }
                        }
                        return result;
                    })
                );
            }) // end switchmap
        );
    }

    /**
     * Save the current state of the STIX object in the database. Update the current object from the response
     * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
     * @returns {Observable} of the post
     */
     public save(restAPIService: RestApiConnectorService): Observable<UserAccount> {
        const putObservable = restAPIService.putUserAccount(this);
        const subscription = putObservable.subscribe({
            next: (result) => { this.deserialize(this.serialize()); },
            complete: () => { subscription.unsubscribe(); }
        });
        return putObservable;
    }
}
