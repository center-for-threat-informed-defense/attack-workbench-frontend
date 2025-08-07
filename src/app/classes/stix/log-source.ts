import { StixObject } from './stix-object';
import { logger } from '../../utils/logger';
import { map, Observable } from 'rxjs';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { ValidationData } from '../serializable';

export class LogSource extends StixObject {
  public name = '';
  public permutations: LogSourcePermutation[] = [];

  public readonly supportsAttackID = true;
  public readonly supportsNamespace = true;
  protected get attackIDValidator() {
    return {
      regex: 'LS\\d{4}',
      format: 'LS####',
    };
  }

  constructor(sdo?) {
    super(sdo, 'x-mitre-log-source');
    if (sdo) {
      this.deserialize(sdo);
    }
  }

  /**
   * Transform the current object into a raw object for sending to the back-end, stripping any unnecessary fields
   * @abstract
   * @returns {*} the raw object to send
   */
  public serialize(keepModified?: string): object {
    const rep = super.base_serialize();
    if (keepModified) rep.stix.modified = keepModified;

    rep.stix.name = this.name.trim();
    if (this.permutations?.length)
      rep.stix.x_mitre_log_source_permutations = this.permutations.map(
        ({ name, channel, data_component_name }) => ({
          name,
          channel,
          data_component_name,
        })
      );
    return rep;
  }

  /**
   * Parse the object from the record returned from the back-end
   * @abstract
   * @param {*} raw the raw object to parse
   */
  public deserialize(raw: object) {
    if ('stix' in raw) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sdo = raw.stix as any;

      if ('name' in sdo) {
        if (typeof sdo.name === 'string') this.name = sdo.name;
        else
          logger.error(
            `TypeError: name field is not a string: ${sdo.name} (${typeof sdo.name})`
          );
      } else this.name = '';

      if ('x_mitre_log_source_permutations' in sdo) {
        if (this.isPermutationsArray(sdo.x_mitre_log_source_permutations))
          this.permutations = sdo.x_mitre_log_source_permutations;
        else
          logger.error(
            `TypeError: x_mitre_log_source_permutations field is not an array of log source permutations: ${sdo.x_mitre_log_source_permutations} (${typeof sdo.x_mitre_log_source_permutations})`
          );
      } else this.permutations = [];
    }
  }

  public isPermutationsArray(arr): boolean {
    return arr.every(a => {
      return 'name' in a && 'channel' in a && 'data_component_name' in a;
    });
  }

  /**
   * Validate the current object state and return information on the result of the validation
   * @param {RestApiConnectorService} restAPIService: the REST API connector through which asynchronous validation can be completed
   * @returns {Observable<ValidationData>} the validation warnings and errors once validation is complete.
   */
  public validate(
    restAPIService: RestApiConnectorService
  ): Observable<ValidationData> {
    return this.base_validate(restAPIService).pipe(
      map(result => {
        // validate unique permutations
        if (this.permutations.length) {
          const seen = new Set<string>();
          for (const { name, channel } of this.permutations) {
            const key = `${name}::${channel}`;
            if (seen.has(key)) {
              result.errors.push({
                field: 'permutations',
                result: 'error',
                message: `Duplicate permutation pair found: name="${name}", channel="${channel}"`,
              });
            }
            seen.add(key);
          }
        }

        return result;
      })
    );
  }

  /**
   * Save the current state of the STIX object in the database. Update the current object from the response
   * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
   * @returns {Observable} of the post
   */
  public save(restAPIService: RestApiConnectorService): Observable<LogSource> {
    const postObservable = restAPIService.postLogSource(this);
    const subscription = postObservable.subscribe({
      next: result => {
        this.deserialize(result.serialize());
      },
      complete: () => {
        subscription.unsubscribe();
      },
    });
    return postObservable;
  }

  /**
   * Delete this STIX object from the database.
   * @param restAPIService [RestApiConnectorService] the service to perform the DELETE through
   */
  public delete(restAPIService: RestApiConnectorService): Observable<object> {
    const deleteObservable = restAPIService.deleteLogSource(this.stixID);
    const subscription = deleteObservable.subscribe({
      complete: () => {
        subscription.unsubscribe();
      },
    });
    return deleteObservable;
  }

  /**
   * Update the state of the STIX object in the database.
   * @param restAPIService [RestApiConnectorService] the service to perform the PUT through
   * @returns {Observable} of the put
   */
  public update(
    restAPIService: RestApiConnectorService
  ): Observable<LogSource> {
    const putObservable = restAPIService.putLogSource(this);
    const subscription = putObservable.subscribe({
      next: result => {
        this.deserialize(result.serialize());
      },
      complete: () => {
        subscription.unsubscribe();
      },
    });
    return putObservable;
  }
}

export interface LogSourcePermutation {
  name: string;
  channel: string;
  data_component_name: string;
}
