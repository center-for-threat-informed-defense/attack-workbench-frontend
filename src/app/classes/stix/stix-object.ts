import {
  createAttackIdSchema,
  StixTypesWithAttackIds,
} from '@mitre-attack/attack-data-model/dist/schemas/common/attack-id';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  Paginated,
  RestApiConnectorService,
} from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import {
  AttackTypeToRoute,
  StixTypeToAttackType,
} from 'src/app/utils/type-mappings';
import { StixType } from 'src/app/utils/types';
import { v4 as uuid } from 'uuid';
import { logger } from '../../utils/logger';
import { ExternalReferences } from '../external-references';
import { Serializable, ValidationData } from '../serializable';
import { VersionNumber } from '../version-number';

export type workflowStates =
  | 'work-in-progress'
  | 'awaiting-review'
  | 'reviewed'
  | '';

export abstract class StixObject extends Serializable {
  public stixID: string; // STIX ID
  public type: string; // STIX type
  public attackType: string; // ATT&CK type
  public attackID: string; // ATT&CK ID
  public description: string;

  public created_by_ref: string; //embedded relationship
  public created_by?: any;
  public modified_by_ref: string; //embedded relationship
  public modified_by?: any;
  public firstInitialized: boolean; // boolean to track if it is a newly created object

  public object_marking_refs: string[] = []; //list of embedded relationships to marking_defs

  public abstract readonly supportsAttackID: boolean; // boolean to determine if object supports ATT&CK IDs
  protected abstract get attackIDValidator(): {
    regex: string; // regex to validate the ID
    format: string; // format to display to user
  };

  protected buildAttackExternalReference(): object | null {
    if (this.attackID && AttackTypeToRoute[this.attackType]) {
      return {
        source_name: 'mitre-attack',
        external_id: this.attackID,
        url: `https://attack.mitre.org/${AttackTypeToRoute[this.attackType]}/${this.attackID.replace(/\./g, '/')}`,
      };
    }
    return null;
  }

  private defaultMarkingDefinitionsLoaded = false; // avoid overloading of default marking definitions

  public get routes(): any[] {
    // route to view the object
    return [
      {
        label: 'view',
        route: '',
      },
      {
        label: 'edit',
        route: '',
        query: { editing: true },
      },
    ];
  }

  public created: Date; // object created date
  public modified: Date; // object modified date
  public version: VersionNumber; // version number of the object
  public external_references: ExternalReferences;
  public workflow: {
    state: workflowStates;
    created_by_user_account?: string;
  };

  public deprecated = false; //is object deprecated?
  public revoked = false; //is object revoked?

  /**
   * Initialize the STIX object
   * @param sdo the STIX domain object to initialize data from
   */
  constructor(sdo?: any, type?: string) {
    super();
    if (sdo) {
      this.base_deserialize(sdo);
      this.firstInitialized = false;
    } else {
      // create new SDO
      this.stixID = type + '--' + uuid();
      this.type = type;
      this.version = new VersionNumber('0.1');
      this.attackID = '';
      this.external_references = new ExternalReferences();
      if (this.type !== 'x-mitre-collection') {
        this.workflow = {
          state: 'work-in-progress',
        };
      }
      this.description = '';
      this.firstInitialized = true;
    }
    this.attackType = StixTypeToAttackType[this.type];
  }

  /**
   * Transform the current object into a raw object for sending to the back-end, stripping any unnecessary fields
   * @abstract
   * @returns {*} the raw object to send
   */
  public base_serialize(): any {
    const serialized_external_references = this.external_references.serialize();

    // Add attackID entry
    const attackExtRef = this.buildAttackExternalReference();
    if (attackExtRef) {
      serialized_external_references.unshift(attackExtRef);
    }

    const stix: any = {
      type: this.type,
      id: this.stixID,
      created: this.created
        ? this.created.toISOString()
        : new Date().toISOString(),
      x_mitre_version: this.version.toString(),
      external_references: serialized_external_references,
      x_mitre_deprecated: this.deprecated,
      revoked: this.revoked,
      object_marking_refs: this.object_marking_refs,
      spec_version: '2.1',
    };
    if (this.description) stix.description = this.description;
    // Add modified date if type is not marking-definition
    if (this.type != 'marking-definition')
      stix['modified'] = new Date().toISOString();
    if (this.created_by_ref) stix.created_by_ref = this.created_by_ref;
    // do not set modified by ref since we don't know who we are, but the REST API knows

    return {
      workspace: {
        workflow: this.workflow || {},
      },
      stix: stix,
    };
  }

  /**
   * Parse the object from the record returned from the back-end
   * @abstract
   * @param {*} raw the raw object to parse
   */
  public base_deserialize(raw: any) {
    if ('stix' in raw) {
      const sdo = raw.stix;

      // initialize common fields from SDO stix
      if ('id' in sdo) {
        if (typeof sdo.id === 'string') this.stixID = sdo.id;
        else
          logger.error(
            'TypeError: id field is not a string:',
            sdo.id,
            '(',
            typeof sdo.id,
            ')'
          );
      }

      if ('object_marking_refs' in sdo) {
        if (this.isStringArray(sdo.object_marking_refs))
          this.object_marking_refs = sdo.object_marking_refs;
        else
          logger.error(
            'TypeError, object_marking_refs field is not a string array',
            this.object_marking_refs,
            '(',
            typeof this.object_marking_refs,
            ')'
          );
      }

      if ('type' in sdo) {
        if (typeof sdo.type === 'string') this.type = sdo.type;
        else
          logger.error(
            'TypeError: type field is not a string:',
            sdo.type,
            '(',
            typeof sdo.type,
            ')'
          );
      }

      if ('description' in sdo) {
        if (typeof sdo.description === 'string')
          this.description = sdo.description;
        else
          logger.error(
            'TypeError: description field is not a string:',
            sdo.description,
            '(',
            typeof sdo.description,
            ')'
          );
      } else this.description = '';

      if ('created' in sdo) {
        if (typeof sdo.created === 'string')
          this.created = new Date(sdo.created);
        else
          logger.error(
            'TypeError: created field is not a string:',
            sdo.created,
            '(',
            typeof sdo.created,
            ')'
          );
      } else this.created = new Date();

      if ('created_by_ref' in sdo) {
        if (typeof sdo.created === 'string')
          this.created_by_ref = sdo.created_by_ref;
        else
          logger.error(
            'TypeError: created_by_Ref field is not a string:',
            sdo.created_by_ref,
            '(',
            typeof sdo.created_by_ref,
            ')'
          );
      }

      if ('modified' in sdo) {
        if (typeof sdo.modified === 'string')
          this.modified = new Date(sdo.modified);
        else
          logger.error(
            'TypeError: modified field is not a string:',
            sdo.modified,
            '(',
            typeof sdo.modified,
            ')'
          );
      } else if ('type' in sdo && sdo.type != 'marking-definition')
        this.modified = new Date();

      if ('x_mitre_modified_by_ref' in sdo) {
        if (typeof sdo.created === 'string')
          this.modified_by_ref = sdo.x_mitre_modified_by_ref;
        else
          logger.error(
            'TypeError: x_mitre_modified_by_ref field is not a string:',
            sdo.x_mitre_modified_by_ref,
            '(',
            typeof sdo.x_mitre_modified_by_ref,
            ')'
          );
      }

      if ('x_mitre_version' in sdo) {
        if (typeof sdo.x_mitre_version === 'string')
          this.version = new VersionNumber(sdo.x_mitre_version);
        else
          logger.error(
            'TypeError: x_mitre_version field is not a string:',
            sdo.x_mitre_version,
            '(',
            typeof sdo.x_mitre_version,
            ')'
          );
      } else this.version = new VersionNumber('0.1');

      if ('external_references' in sdo && sdo['external_references']) {
        if (typeof sdo.external_references === 'object') {
          this.external_references = new ExternalReferences(
            sdo.external_references
          );
          const attack_sources = [
            'mitre-attack',
            'mitre-mobile-attack',
            'mitre-ics-attack',
          ];
          if (
            sdo.external_references.length > 0 &&
            this.type != 'relationship' &&
            sdo.external_references[0].hasOwnProperty('external_id') &&
            sdo.external_references[0].hasOwnProperty('source_name') &&
            attack_sources.includes(sdo.external_references[0].source_name)
          ) {
            if (typeof sdo.external_references[0].external_id === 'string')
              this.attackID = sdo.external_references[0].external_id;
            else
              logger.error(
                'TypeError: attackID field is not a string:',
                sdo.external_references[0].external_id,
                '(',
                typeof sdo.external_references[0].external_id,
                ')'
              );
          } else this.attackID = '';
        } else
          logger.error(
            'TypeError: external_references field is not an object:',
            sdo.external_references,
            '(',
            typeof sdo.external_references,
            ')'
          );
      } else {
        this.external_references = new ExternalReferences();
        this.attackID = '';
      }

      if ('x_mitre_deprecated' in sdo) {
        if (typeof sdo.x_mitre_deprecated === 'boolean')
          this.deprecated = sdo.x_mitre_deprecated;
        else
          logger.error(
            'TypeError: x_mitre_deprecated field is not a boolean:',
            sdo.x_mitre_deprecated,
            '(',
            typeof sdo.x_mitre_deprecated,
            ')'
          );
      }
      if ('revoked' in sdo) {
        if (typeof sdo.revoked === 'boolean') this.revoked = sdo.revoked;
        else
          logger.error(
            'TypeError: revoked field is not a boolean:',
            sdo.revoked,
            '(',
            typeof sdo.revoked,
            ')'
          );
      }
    } else logger.error("ObjectError: 'stix' field does not exist in object");

    if ('created_by_identity' in raw && raw.created_by_identity) {
      const identityData = raw.created_by_identity;
      if ('stix' in identityData) {
        this.created_by = identityData.stix;
      } else
        logger.error(
          "ObjectError: 'stix' field does not exist in created_by_identity object"
        );
    }
    if ('modified_by_identity' in raw && raw.modified_by_identity) {
      const identityData = raw.modified_by_identity;
      if ('stix' in identityData) {
        this.modified_by = identityData.stix;
      } else
        logger.error(
          "ObjectError: 'stix' field does not exist in modified_by_identity object"
        );
    }

    if ('workspace' in raw) {
      // parse workspace fields
      const workspaceData = raw.workspace;
      if ('workflow' in workspaceData && workspaceData.workflow !== undefined) {
        if (typeof workspaceData.workflow == 'object') {
          this.workflow = workspaceData.workflow;
        } else
          logger.error(
            'TypeError: workflow field is not an object',
            workspaceData
          );
      }
    }
  }

  /**
   * Validate the object's ATT&CK ID
   * This function handles cases in which the object has an organization prefix
   * @returns true if the ATT&CK ID is valid, false otherwise
   */
  public isValidAttackId(): boolean {
    if (this.type in StixTypeToAttackType) {
      const attackIDSchema = createAttackIdSchema(
        this.type as StixTypesWithAttackIds
      );
      const attackIDValid = attackIDSchema.safeParse(this.attackID);
      return attackIDValid.success;
    }
    return false;
  }

  /**
   * Validate the current object state and return information on the result of the validation
   * @abstract
   * @param {RestApiConnectorService} restAPIService: the REST API connector through which asynchronous validation can be completed
   * @returns {Observable<ValidationData>} the validation warnings and errors once validation is complete.
   */
  public base_validate(
    restAPIService: RestApiConnectorService
  ): Observable<ValidationData> {
    // check any asynchronous validators
    const result = new ValidationData();
    const validator = restAPIService.validateStixObject();

    return validator(this).pipe(
      switchMap(validatorResult => {
        // Process validation errors from API (backend now handles error-to-warning conversion)
        (validatorResult.errors || []).forEach((err: any) => {
          const errorMessage = `${err.path.join('.')}: ${err.message}`;
          result.errors.push({
            result: 'error',
            field: 'temp',
            message: errorMessage,
          });
        });

        // Process validation warnings from API
        (validatorResult.warnings || []).forEach((warning: any) => {
          const warningMessage =
            warning.message || `${warning.path.join('.')}: ${warning.message}`;
          result.warnings.push({
            result: 'warning',
            field: warning.path[warning.path.length - 1] || 'temp',
            message: warningMessage,
          });
        });
        // check if the name is unique if it has a name
        //do not check name or attackID for relationships or marking definitions
        if (
          this.attackType == 'relationship' ||
          this.attackType == 'marking-definition'
        )
          return of(result);
        // check if name & ATT&CK ID is unique, record result in validation, and return validation
        const options = {
          // validate against revoked & deprecated objects
          includeRevoked: true,
          includeDeprecated: true,
        };
        let accessor: Observable<Paginated<StixObject>>;
        if (this.attackType == 'collection')
          accessor = restAPIService.getAllCollections(options);
        else if (this.attackType == 'group')
          accessor = restAPIService.getAllGroups(options);
        else if (this.attackType == 'campaign')
          accessor = restAPIService.getAllCampaigns(options);
        else if (this.attackType == 'software')
          accessor = restAPIService.getAllSoftware(options);
        else if (this.attackType == 'matrix')
          accessor = restAPIService.getAllMatrices(options);
        else if (this.attackType == 'mitigation')
          accessor = restAPIService.getAllMitigations(options);
        else if (this.attackType == 'technique')
          accessor = restAPIService.getAllTechniques(options);
        else if (this.attackType == 'data-source')
          accessor = restAPIService.getAllDataSources(options);
        else if (this.attackType == 'data-component')
          accessor = restAPIService.getAllDataComponents(options);
        else if (this.attackType == 'asset')
          accessor = restAPIService.getAllAssets();
        else if (this.attackType == 'analytic')
          accessor = restAPIService.getAllAnalytics(options);
        else if (this.attackType == 'detection-strategy')
          accessor = restAPIService.getAllDetectionStrategies(options);
        else accessor = restAPIService.getAllTactics(options);

        return accessor.pipe(
          map(objects => {
            // check name
            if (this.hasOwnProperty('name')) {
              if (
                objects.data.some(
                  x =>
                    x['name'].toLowerCase() == this['name'].toLowerCase() &&
                    x.stixID != this.stixID
                )
              ) {
                result.warnings.push({
                  result: 'warning',
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
            // check ATT&CK ID, ignoring collections and matrices
            if (
              this.attackType !== 'matrix' &&
              this.hasOwnProperty('supportsAttackID') &&
              this.supportsAttackID
            ) {
              if (
                objects.data.some(
                  x => x.attackID == this.attackID && x.stixID != this.stixID
                )
              ) {
                result.errors.push({
                  result: 'error',
                  field: 'attackID',
                  message: 'ATT&CK ID is not unique',
                });
              } else {
                result.successes.push({
                  result: 'success',
                  field: 'attackID',
                  message: 'ATT&CK ID is unique',
                });
              }
            }
            // check required first/last seen fields for campaigns
            return result;
          })
        );
      }), //end switchmap
      // validate external references
      switchMap(result => {
        // build list of fields to validate external references on according to ATT&CK type
        const refs_fields = ['description'];
        if (['software', 'group', 'campaign'].includes(this.attackType))
          refs_fields.push('aliases');
        if (this.attackType == 'asset') refs_fields.push('relatedAssets');
        if (this.attackType == 'technique') refs_fields.push('detection');

        return this.external_references
          .validate(restAPIService, { object: this, fields: refs_fields })
          .pipe(
            map(refs_result => {
              result.merge(refs_result);
              return result;
            })
          );
      }),
      // validate LinkByIDs
      switchMap(result => {
        // build list of fields supporting LinkByIDs
        const refs_fields = ['description'];
        if (this.attackType == 'technique') refs_fields.push('detection');

        const parse_apis = [];
        for (const field of refs_fields) {
          parse_apis.push(this.parseLinkByIds(this[field], restAPIService));
        }

        return forkJoin(parse_apis).pipe(
          map(api_results => {
            const validation_results = api_results as LinkByIdParseResult[];
            const linkResult = new LinkByIdParseResult();
            for (const validation_result of validation_results) {
              linkResult.merge(validation_result); // merge all results to a single object
            }

            // broken links
            const brokenLinks = Array.from(linkResult.brokenLinks);
            if (brokenLinks.length == 1)
              result.errors.push({
                result: 'error',
                field: 'description',
                message: `LinkById ${brokenLinks[0]} does not match format (LinkById: ATT&CK ID)`,
              });
            else if (brokenLinks.length > 1)
              result.errors.push({
                result: 'error',
                field: 'description',
                message: `LinkByIds ${brokenLinks.join(', ')} do not match format (LinkById: ATT&CK ID)`,
              });

            // missing links
            const missingLinks = Array.from(linkResult.missingLinks);
            if (missingLinks.length == 1)
              result.errors.push({
                result: 'error',
                field: 'description',
                message: `Cannot find linked object: ${missingLinks[0]}`,
              });
            else if (missingLinks.length > 1)
              result.errors.push({
                result: 'error',
                field: 'description',
                message: `Cannot find linked objects: ${missingLinks.join(', ')}`,
              });
            return result;
          })
        );
      }),
      // validate 'revoked-by' relationship exists
      switchMap(result => {
        if (!this.revoked) return of(result); // do not check for revoked-by relationship

        const accessor = restAPIService.getRelatedTo({
          sourceRef: this.stixID,
        });
        return accessor.pipe(
          map(objects => {
            if (
              !objects.data.find(
                relationship =>
                  relationship['relationship_type'] == 'revoked-by'
              )
            ) {
              result.errors.push({
                result: 'error',
                field: 'revoked',
                message: "'revoked-by' relationship does not exist",
              });
            } else {
              result.successes.push({
                result: 'success',
                field: 'revoked',
                message: "'revoked-by' relationship exists",
              });
            }
            return result;
          })
        );
      })
    ); //end pipe
  }

  /**
   * parses given field for linked objects
   * @param field the field in which to parse LinkByIds
   */
  private parseLinkByIds(
    field: string,
    restAPIService: RestApiConnectorService
  ): Observable<LinkByIdParseResult> {
    const reLinkById = /\(LinkById: (.*?)\)/gmu;
    const links = field.match(reLinkById);
    const result = new LinkByIdParseResult({
      brokenLinks: this.validateBrokenLinks(field, [
        /\(LinkById:([^ ].*?)\)/gmu,
        /\(LinkByID:(.*?)\)/gmu,
        /\(linkById:(.*?)\)/gmu,
      ]),
    });

    if (!links) return of(result); // no LinkByIds found

    const ids = [];
    for (const link of links) {
      const id = link.split('(LinkById: ')[1].slice(0, -1);
      if (!ids.includes(id) && id != '') ids.push(id);
    }

    return restAPIService
      .getAllObjects({
        attackIDs: ids,
        revoked: true,
        deprecated: true,
        deserialize: true,
      })
      .pipe(
        map((results: any) => {
          // objects must be validated in cases where more than one object is
          // returned by the given ATT&CK ID, this occurs due to older versions
          // of ATT&CK in which techniques shared their IDs with mitigations
          const validObjects = (results.data as StixObject[]).filter(
            obj => obj.supportsAttackID && obj.isValidAttackId()
          );
          const retrieved_ids = validObjects.map(obj => obj.attackID);
          for (const id of ids) {
            if (!retrieved_ids.includes(id)) result.missingLinks.add(id);
          }
          return result;
        })
      );
  }

  /**
   * validate the given field for broken LinkByIds found via regex
   * @param field field that may have LinkByIds
   * @param {regex[]} regExes regular expressions matching potential invalid tags
   */
  private validateBrokenLinks(field: string, regExes): Set<string> {
    const result = new Set<string>();
    for (const regex of regExes) {
      const brokenLinks = field.match(regex);
      if (brokenLinks) {
        brokenLinks.forEach(l => result.add(l));
      }
    }
    return result;
  }

  /**
   * Checks if the provided field has a valid value.
   * Returns false for undefined, null, empty string, or empty array.
   * @param {*} field - The value to validate.
   * @returns {boolean} - True if the field has a value, false otherwise.
   */
  public hasValue(field) {
    return (
      field !== undefined &&
      field !== null &&
      field !== '' &&
      !(Array.isArray(field) && field.length === 0)
    );
  }

  /**
   * Filters the properties of an object, returning a new object containing only
   * those entries whose values pass the hasValue check.
   * @param {Object} obj - The object to filter.
   * @returns {Object} - A new object with only the valid entries.
   */
  public filterObject(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(entry => this.hasValue(entry[1]))
    );
  }

  /**
   * Check if the given array is a list of strings
   * @param arr the array to check
   * @returns true if all objects in the array are of type string, false otherwise
   */
  public isStringArray = function (arr): boolean {
    for (const a of arr) {
      if (typeof a !== 'string') {
        logger.error('TypeError:', a, '(', typeof a, ')', 'is not a string');
        return false;
      }
    }
    return true;
  };

  /**
   * Save the current state of the STIX object in the database. Update the current object from the response
   * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
   * @returns {Observable} of the post
   */
  abstract save(
    restAPIService: RestApiConnectorService
  ): Observable<StixObject>;

  /**
   * Delete the STIX object from the database.
   * @param restAPIService [RestApiConnectorService] the service to perform the DELETE through
   */
  abstract delete(restAPIService: RestApiConnectorService): Observable<object>;

  /**
   * Update the state of the STIX object in the database. Update the current object from the response
   * @param restAPIService [RestApiConnectorService] the service to perform the PUT through
   * @returns {Observable} of the pout
   */
  abstract update(restAPIService: RestApiConnectorService): Observable<object>;

  /**
   * Updates the object's marking definitions with the default the first time an object is created
   * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
   */
  public setDefaultMarkingDefinitions(restAPIService: RestApiConnectorService) {
    const data$ = restAPIService.getDefaultMarkingDefinitions();
    const sub = data$.subscribe({
      next: data => {
        const marking_refs = [];
        for (const i in data) {
          marking_refs.push(data[i].stix.id); // Select current statements by default
        }
        this.object_marking_refs = marking_refs;
        this.defaultMarkingDefinitionsLoaded = true;
      },
      complete: () => {
        sub.unsubscribe();
      },
    });
  }

  public generateAttackId(
    apiService: RestApiConnectorService,
    existingPrefix?: string
  ): Observable<any> {
    this.attackID = '(generating ID)';
    return apiService.getOrganizationNamespace().pipe(
      switchMap(namespace => {
        const accessor = this.getApiAccessor(apiService, this.attackType);
        if (!accessor) return of('(unsupported attack type)');

        const typePrefix = this.getAttackIdPrefix(); // ex: "TA" for tactics
        // org prefix (ex: "ORG"), use existing prefix if defined
        const orgPrefix = existingPrefix
          ? existingPrefix
          : (namespace.prefix ?? '');
        // family prefix: orgPrefix + typePrefix (ex: "ORG-TA" for tactics)
        const familyPrefix = orgPrefix
          ? orgPrefix + '-' + typePrefix
          : typePrefix;

        return accessor.pipe(
          switchMap(objects => {
            if ('is_subtechnique' in this && this['is_subtechnique']) {
              return this.getNextSubtechniqueAttackId(
                apiService,
                familyPrefix,
                typePrefix
              );
            } else {
              return this.getNextObjectAttackId(
                objects,
                familyPrefix,
                typePrefix,
                namespace.range_start
              );
            }
          }),
          map(generatedId => this.formatWithPrefix(generatedId, orgPrefix))
        );
      })
    );
  }

  private getApiAccessor(
    apiService: RestApiConnectorService,
    attackType: string
  ): Observable<Paginated<StixObject>> {
    if (attackType == 'group') return apiService.getAllGroups();
    else if (attackType == 'campaign') return apiService.getAllCampaigns();
    else if (attackType == 'mitigation') return apiService.getAllMitigations();
    else if (attackType == 'software') return apiService.getAllSoftware();
    else if (attackType == 'tactic') return apiService.getAllTactics();
    else if (attackType == 'technique') return apiService.getAllTechniques();
    else if (attackType == 'data-source') return apiService.getAllDataSources();
    else if (attackType == 'data-component')
      return apiService.getAllDataComponents();
    else if (attackType == 'asset') return apiService.getAllAssets();
    else if (attackType == 'matrix') return apiService.getAllMatrices();
    else if (attackType == 'detection-strategy')
      return apiService.getAllDetectionStrategies();
    else if (attackType == 'analytic') return apiService.getAllAnalytics();
    else return null;
  }

  private getAttackIdPrefix(): string {
    return this.attackIDValidator.format.includes('#')
      ? this.attackIDValidator.format.split('#')[0]
      : '';
  }

  private getNextSubtechniqueAttackId(
    apiService: RestApiConnectorService,
    orgPrefix: string,
    typePrefix: string
  ): Observable<string> {
    if (!('parentTechnique' in this && this['parentTechnique'])) {
      return of('(parent technique missing)');
    }

    // get 4-digit ID of parent technique
    const parent = this['parentTechnique'] as StixObject;
    const found = parent.attackID.match(/[0-9]{4}/g);
    if (!found?.length) return of('(invalid parent id)');
    orgPrefix += found[0];

    return apiService.getTechnique(parent.stixID, null, 'latest', true).pipe(
      map(technique => {
        const children = technique[0]?.subTechniques ?? [];
        let count = 1;

        if (children.length > 0) {
          const childIds = children
            .filter(obj => obj.attackID.startsWith(orgPrefix))
            .map(obj => obj.attackID.match(/[^.]([0-9]*)$/g)?.[0])
            .filter(Boolean)
            .map(Number);

          // get next available subtechnique number
          if (childIds.length > 0) {
            count = Math.max(...childIds) + 1;
          }
        }

        // construct new id (e.g. T1234.001)
        return `${typePrefix}${found[0]}.${count.toString().padStart(3, '0')}`;
      })
    );
  }

  private getNextObjectAttackId(
    objects: Paginated<StixObject>,
    orgPrefix: string,
    typePrefix: string,
    rangeStart: string
  ): Observable<string> {
    // get ids of existing objects that have the same prefix
    const currIds = objects.data.reduce((ids, obj) => {
      if (obj.attackID.startsWith(orgPrefix)) {
        // remove non-digits and decimals
        ids.push(obj.attackID.replace(orgPrefix, '').replace(/[.](\d{3})/, ''));
      }
      return ids;
    }, [] as string[]);

    // get next available ID from existing IDs
    const next = currIds.length > 0 ? Number(currIds.sort().pop()) + 1 : 1;

    let newId = next;
    if (this.firstInitialized && rangeStart) {
      // if creating new & range start is defined, use range start if larger than next available ID
      newId = +rangeStart > next ? +rangeStart : next;
    }

    // construct new id (e.g. G0999)
    return of(typePrefix + newId.toString().padStart(4, '0'));
  }

  public formatWithPrefix(attackId: string, orgPrefix: string): string {
    const prefix = orgPrefix ? orgPrefix + '-' : '';
    const withPrefix = attackId.startsWith(prefix)
      ? attackId
      : prefix + attackId;
    // matrix IDs are case sensitive, all others uppercase
    return this.attackType === 'matrix' ? withPrefix : withPrefix.toUpperCase();
  }
}

/**
 * The results of parsing LinkByIds in a single field
 */
export class LinkByIdParseResult {
  public missingLinks = new Set<string>(); // LinkByIds that could not be found
  public brokenLinks = new Set<string>(); // list of broken LinkByIds detected in the field

  constructor(initData?: {
    missingLinks?: Set<string>;
    brokenLinks: Set<string>;
  }) {
    if (initData && initData.missingLinks)
      this.missingLinks = initData.missingLinks;
    if (initData && initData.brokenLinks)
      this.brokenLinks = initData.brokenLinks;
  }

  /**
   * Merge results from another LinkByIdParseResult into this object
   * @param {LinkByIdParseResult} that results from other object
   */
  public merge(that: LinkByIdParseResult) {
    this.missingLinks = new Set([...this.missingLinks, ...that.missingLinks]);
    this.brokenLinks = new Set([...this.brokenLinks, ...that.brokenLinks]);
  }
}

export interface RelatedRef {
  stixId: string;
  name: string;
  attackId: string;
  type: StixType;
}
