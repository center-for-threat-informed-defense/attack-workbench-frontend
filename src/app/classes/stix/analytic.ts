import { StixObject } from './stix-object';
import { logger } from '../../utils/logger';
import { Observable } from 'rxjs';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { ValidationData } from '../serializable';

export class Analytic extends StixObject {
  public platform: string;
  public detects: string;
  public logSources: LogSourceReference[] = [];
  public mutableElements: MutableElement[] = [];

  public readonly supportsAttackID = true;
  public readonly supportsNamespace = true;
  protected get attackIDValidator() {
    return {
      regex: 'AN\\d{4}',
      format: 'AN####',
    };
  }

  constructor(sdo?) {
    super(sdo, 'x-mitre-analytic');
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

    if (this.platform) rep.stix.x_mitre_platform = this.platform;
    if (this.detects) rep.stix.x_mitre_detects = this.detects;
    if (this.logSources?.length)
      rep.stix.x_mitre_log_sources = this.logSources.map(({ ref, keys }) => ({
        ref,
        keys,
      }));
    if (this.mutableElements?.length)
      rep.stix.x_mitre_mutable_elements = this.mutableElements.map(
        ({ field, description }) => ({
          field,
          description,
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

      if ('platform' in sdo) {
        if (typeof sdo.platform === 'string') this.platform = sdo.platform;
        else
          logger.error(
            `TypeError: platform field is not a string: ${sdo.platform} (${typeof sdo.platform})`
          );
      } else this.platform = '';

      if ('x_mitre_log_sources' in sdo) {
        if (this.isLogSourcesArray(sdo.x_mitre_log_sources))
          this.logSources = sdo.x_mitre_log_sources;
        else
          logger.error(
            `TypeError: x_mitre_log_sources field is not an array of log source references: ${sdo.x_mitre_log_sources} (${typeof sdo.x_mitre_log_sources})`
          );
      } else this.logSources = [];

      if ('x_mitre_mutable_elements' in sdo) {
        if (this.isMutableElementsArray(sdo.x_mitre_mutable_elements))
          this.mutableElements = sdo.x_mitre_mutable_elements;
        else
          logger.error(
            `TypeError: x_mitre_mutable_elements field is not an array of log source references: ${sdo.x_mitre_mutable_elements} (${typeof sdo.x_mitre_mutable_elements})`
          );
      } else this.mutableElements = [];

      if ('x_mitre_detects' in sdo) {
        if (typeof sdo.x_mitre_detects === 'string')
          this.detects = sdo.x_mitre_detects;
        else
          logger.error(
            `TypeError: x_mitre_detects field is not a string: ${sdo.x_mitre_detects} (${typeof sdo.x_mitre_detects})`
          );
      }
    }
  }

  public isLogSourcesArray(arr): boolean {
    return arr.every(a => {
      return 'ref' in a && 'keys' in a;
    });
  }

  public isMutableElementsArray(arr): boolean {
    return arr.every(a => {
      return 'field' in a && 'description' in a;
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
    return this.base_validate(restAPIService);
  }

  /**
   * Save the current state of the STIX object in the database. Update the current object from the response
   * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
   * @returns {Observable} of the post
   */
  public save(restAPIService: RestApiConnectorService): Observable<Analytic> {
    const postObservable = restAPIService.postAnalytic(this);
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
    const deleteObservable = restAPIService.deleteAnalytic(this.stixID);
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
  public update(restAPIService: RestApiConnectorService): Observable<Analytic> {
    const putObservable = restAPIService.putAnalytic(this);
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

export interface LogSourceReference {
  ref: string;
  keys: string[];
}

export interface MutableElement {
  field: string;
  description: string;
}
