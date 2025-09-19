import { StixObject } from './stix-object';
import { logger } from '../../utils/logger';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { ValidationData } from '../serializable';

export class Analytic extends StixObject {
  public name = '';
  public platform: string;
  public detects: string;
  public domains: string[] = [];
  public logSourceRefs: LogSourceReference[] = [];
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

    if (this.name) rep.stix.name = this.name.trim();
    if (this.platform) {
      // convert to array to match spec
      rep.stix.x_mitre_platforms = [this.platform];
    }
    if (this.domains) rep.stix.x_mitre_domains = this.domains;
    if (this.detects) rep.stix.x_mitre_detects = this.detects;
    if (this.logSourceRefs?.length)
      rep.stix.x_mitre_log_sources = this.logSourceRefs.map(
        ({ ref, keys }) => ({
          ref,
          keys,
        })
      );
    if (this.mutableElements?.length)
      rep.stix.x_mitre_mutable_elements = this.mutableElements.map(
        ({ field, description }) => ({
          field,
          description,
        })
      );
    
    // Strip properties that are empty strs + lists
    rep.stix = this.filterObject(rep.stix);

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

      if (!('name' in sdo)) this.name = '';
      else if (typeof sdo.name === 'string') this.name = sdo.name;
      else
        logger.error(
          `TypeError: name field is not a string: ${sdo.name} (${typeof sdo.name})`
        );
      if ('x_mitre_platforms' in sdo) {
        if (this.isStringArray(sdo.x_mitre_platforms)) {
          if (sdo.x_mitre_platforms.length <= 1) {
            this.platform =
              sdo.x_mitre_platforms.length === 1
                ? sdo.x_mitre_platforms[0]
                : '';
          } else
            logger.error(
              'ValidationError: platforms field contains more than one entry.'
            );
        } else
          logger.error(`TypeError: platforms field is not a string array.`);
      } else this.platform = '';

      if ('x_mitre_domains' in sdo) {
        if (this.isStringArray(sdo.x_mitre_domains))
          this.domains = sdo.x_mitre_domains;
        else logger.error('TypeError: domains field is not a string array.');
      } else this.domains = [];

      if ('x_mitre_log_sources' in sdo) {
        if (this.isLogSourcesArray(sdo.x_mitre_log_sources))
          this.logSourceRefs = sdo.x_mitre_log_sources;
        else
          logger.error(
            `TypeError: x_mitre_log_sources field is not an array of log source references: ${sdo.x_mitre_log_sources} (${typeof sdo.x_mitre_log_sources})`
          );
      } else this.logSourceRefs = [];

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
    return this.base_validate(restAPIService).pipe(
      switchMap(result => {
        // validate unique mutable fields
        if (this.mutableElements.length) {
          const seen = new Set<string>();
          for (const { field } of this.mutableElements) {
            const normalizedField = field.toLowerCase(); // ignore case
            if (seen.has(normalizedField)) {
              result.errors.push({
                field: 'mutableElements',
                result: 'error',
                message: `Duplicate mutable element field found: ${field}`,
              });
            }
            seen.add(normalizedField);
          }
        }

        // validate unique log source refs
        if (this.logSourceRefs.length) {
          const refs = this.logSourceRefs.map(({ ref }) => ref);

          return forkJoin(
            refs.map(ref =>
              restAPIService.getLogSource(ref).pipe(
                catchError(() => of(null)) // fallback if API fails
              )
            )
          ).pipe(
            map(logSources => {
              const seen = new Set<string>();
              this.logSourceRefs.forEach(({ ref }, index) => {
                if (seen.has(ref)) {
                  const logSource = logSources[index];
                  result.errors.push({
                    field: 'logSourceRefs',
                    result: 'error',
                    message: `Duplicate log source reference found: ${logSource?.[0].attackID || 'unknown'}`,
                  });
                }
                seen.add(ref);
              });
              return result;
            })
          );
        }

        return of(result);
      })
    );
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
