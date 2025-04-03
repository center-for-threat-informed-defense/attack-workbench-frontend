import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RestApiConnectorService } from '../../services/connectors/rest-api/rest-api-connector.service';
import { logger } from '../../utils/logger';
import { Serializable, ValidationData } from '../serializable';

export class Team extends Serializable {
  public id: string;
  public name: string;
  public description: string;
  public userIDs: string[] = [];
  public created: Date;
  public modified: Date;

  /**
   * Initialize user account object
   */
  constructor(raw?: any) {
    super();
    if (raw) {
      this.deserialize(raw);
    }
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
      userIDs: this.userIDs,
      created: this.created.toISOString(),
      modified: this.modified.toISOString(),
    };
  }

  /**
   * Check if the given array is a list of strings
   * @param arr the array to check
   * @returns true if all objects in the array are of type string, false otherwise
   */
  public isStringArray = function (arr): boolean {
    if (!Array.isArray(arr)) {
      return false;
    }
    for (const a of arr) {
      if (typeof a !== 'string') {
        logger.error('TypeError:', a, '(', typeof a, ')', 'is not a string');
        return false;
      }
    }
    return true;
  };

  /**
   * Parse the object from the record returned from the back-end
   * @abstract
   * @param {*} raw the raw object to parse
   */
  public deserialize(raw: any) {
    if (!('id' in raw)) this.id = '';
    else if (typeof raw.id === 'string') this.id = raw.id;
    else logger.error(`TypeError: id field is not a string: ${raw.id} (${typeof raw.id})`);

    if (!('name' in raw)) this.name = '';
    else if (typeof raw.name === 'string') this.name = raw.name;
    else logger.error(`TypeError: name field is not a string: ${raw.name} (${typeof raw.name})`);

    if (!('description' in raw)) this.description = '';
    else if (typeof raw.description === 'string' || typeof raw.description === 'undefined')
      this.description = raw.description;
    else
      logger.error(
        `TypeError: description field is not a string: ${raw.description} (${typeof raw.description})`,
      );

    if ('userIDs' in raw && raw.userIDs) {
      if (this.isStringArray(raw.userIDs)) this.userIDs = raw.userIDs;
      else
        logger.error(
          `TypeError: userIDs field is not a string array: ${raw.userIDs} (${typeof raw.userIDs})`,
        );
    }

    if (!('created' in raw)) this.created = new Date();
    else if (typeof raw.created === 'string') this.created = new Date(raw.created);
    else
      logger.error(
        `TypeError: created field is not a string: ${raw.created} (${typeof raw.created})`,
      );

    if (!('modified' in raw)) this.modified = new Date();
    else if (typeof raw.modified === 'string') this.modified = new Date(raw.modified);
    else
      logger.error(
        `TypeError: modified field is not a string: ${raw.modified} (${typeof raw.modified})`,
      );
  }

  /**
   * Validate the current object state and return information on the result of the validation
   * @param {RestApiConnectorService} restAPIService: the REST API connector through which asynchronous validation can be completed
   * @returns {Observable<ValidationData>} the validation warnings and errors once validation is complete.
   */
  public validate(restAPIService: RestApiConnectorService): Observable<ValidationData> {
    const validation = new ValidationData();
    return of(validation).pipe(
      // check if team name is unique
      switchMap((result) => {
        return restAPIService.getAllTeams({ includePagination: true }).pipe(
          map((teams) => {
            if (this.hasOwnProperty('name')) {
              if (this.name == '') {
                result.errors.push({
                  result: 'error',
                  field: 'name',
                  message: 'team has no name',
                });
              } else if (
                teams.data.some(
                  (x) => x.name.toLowerCase() == this.name.toLowerCase() && x.id != this.id,
                )
              ) {
                result.errors.push({
                  result: 'error',
                  field: 'name',
                  message: 'name is not unique',
                });
              } else {
                result.successes.push({
                  result: 'success',
                  field: 'name',
                  message: 'name is unique',
                });
              }
            }
            return result;
          }),
        );
      }), // end switchmap
    );
  }

  /**
   * Save the current state of the STIX object in the database. Update the current object from the response
   * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
   * @returns {Observable} of the post
   */
  public save(restAPIService: RestApiConnectorService): Observable<Team> {
    const putObservable = restAPIService.putTeam(this);
    const subscription = putObservable.subscribe({
      next: (result) => {
        this.deserialize(this.serialize());
      },
      complete: () => {
        subscription.unsubscribe();
      },
    });
    return putObservable;
  }
}
