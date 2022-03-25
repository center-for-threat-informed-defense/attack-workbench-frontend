import { Relationship } from './relationship';
import { VersionNumber } from '../version-number';
import { ExternalReferences } from '../external-references';
import { v4 as uuid } from 'uuid';
import { Serializable, ValidationData } from '../serializable';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { logger } from "../../util/logger";

export type workflowStates = "work-in-progress" | "awaiting-review" | "reviewed" | "";
let stixTypeToAttackType = {
    "x-mitre-collection": "collection",
    "attack-pattern": "technique",
    "malware": "software",
    "tool": "software",
    "intrusion-set": "group",
    "course-of-action": "mitigation",
    "x-mitre-matrix": "matrix",
    "x-mitre-tactic": "tactic",
    "relationship": "relationship",
    "marking-definition": "marking-definition",
    "x-mitre-data-source": "data-source",
    "x-mitre-data-component": "data-component"
}
export {stixTypeToAttackType};

export abstract class StixObject extends Serializable {
    public stixID: string; // STIX ID
    public type: string;   // STIX type
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
    public abstract readonly supportsNamespace: boolean; // boolean to determine if object supports namespacing of ATT&CK ID
    protected abstract get attackIDValidator(): {
        regex: string, // regex to validate the ID
        format: string // format to display to user
    };

    private typeUrlMap = {
        "technique": "techniques",
        "software": "software",
        "group": "groups",
        "mitigation": "mitigations",
        "matrix": "matrices",
        "tactic": "tactics",
        "note": "notes",
        "marking-definition": "marking-definitions",
        "data-source": "data-sources",
        "data-component": "data-components"
    }

    private defaultMarkingDefinitionsLoaded = false; // avoid overloading of default marking definitions

    public get routes(): any[] { // route to view the object
        // let baseRoute = "/" + [this.attackType, this.stixID].join("/")
        return [
            {
                "label": "view",
                "route": ""
            }, {
                "label": "edit",
                "route": "",
                "query": {"editing": true}
            }
        ]
    }

    public created: Date;  // object created date
    public modified: Date; // object modified date
    public version: VersionNumber;  // version number of the object
    public external_references: ExternalReferences;
    public workflow: {
        state: workflowStates,
        created_by_user_account?: string
    };

    public deprecated: boolean = false; //is object deprecated?
    public revoked: boolean = false;    //is object revoked?

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
            this.stixID = type + "--" + uuid();
            this.type = type;
            this.version = new VersionNumber("0.1");
            this.attackID = '';
            this.external_references = new ExternalReferences();
            if (this.type !== 'x-mitre-collection') {
                this.workflow = {
                    state: "work-in-progress"
                };
            }
            this.description = "";
            this.firstInitialized = true;
        }
        this.attackType = stixTypeToAttackType[this.type]
    }

    /**
     * Transform the current object into a raw object for sending to the back-end, stripping any unnecessary fields
     * @abstract
     * @returns {*} the raw object to send
     */
    public base_serialize(): any {

        let serialized_external_references = this.external_references.serialize();

        // Add attackID for
        if (this.attackID && this.typeUrlMap[this.attackType]) {
            let new_ext_ref = {
                "source_name": "mitre-attack",
                "external_id": this.attackID
            }

            // Add url
            // TODO: replace url with configuration
            new_ext_ref["url"] = "https://attack.mitre.org/" + this.typeUrlMap[this.attackType] + "/"

            let ID = this.attackID;

            // Split attackID if it contains a '.'
            if (this.attackID.split(".").length == 2) {
                let divider = this.attackID.split(".");
                ID = divider[0] + "/" + divider[1];
            }

            // Add attackID to url
            new_ext_ref["url"] = new_ext_ref["url"] + ID;

            serialized_external_references.unshift(new_ext_ref);
        }

        let stix: any = {
            "type": this.type,
            "id": this.stixID,
            "created": this.created? this.created.toISOString() : new Date().toISOString(),
            "x_mitre_version": this.version.toString(),
            "external_references": serialized_external_references,
            "x_mitre_deprecated": this.deprecated,
            "revoked": this.revoked,
            "description": this.description,
            "object_marking_refs": this.object_marking_refs,
            "spec_version": "2.1"
        }
        // Add modified data if type is not marking-definition
        if (this.type != "marking-definition") stix["modified"] = new Date().toISOString();
        if (this.created_by_ref) stix.created_by_ref = this.created_by_ref;
        // do not set modified by ref since we don't know who we are, but the REST API knows

        return {
            workspace:  {
                workflow: this.workflow
            },
            stix: stix
        }
    }

    /**
     * Parse the object from the record returned from the back-end
     * @abstract
     * @param {*} raw the raw object to parse
     */
    public base_deserialize(raw: any) {
        if ("stix" in raw) {
            let sdo = raw.stix;

            // initialize common fields from SDO stix
            if ("id" in sdo) {
                if (typeof(sdo.id) === "string") this.stixID = sdo.id;
                else logger.error("TypeError: id field is not a string:", sdo.id, "(",typeof(sdo.id),")")
            }

            if ("object_marking_refs" in sdo) {
                if (this.isStringArray(sdo.object_marking_refs)) this.object_marking_refs = sdo.object_marking_refs;
                else logger.error("TypeError, object_marking_refs field is not a string array", this.object_marking_refs, "(", typeof(this.object_marking_refs), ")");
            }

            if ("type" in sdo) {
                if (typeof(sdo.type) === "string") this.type = sdo.type;
                else logger.error("TypeError: type field is not a string:", sdo.type, "(",typeof(sdo.type),")")
            }

            if ("description" in sdo) {
                if (typeof(sdo.description) === "string") this.description = sdo.description;
                else logger.error("TypeError: description field is not a string:", sdo.description, "(",typeof(sdo.description),")")
            } else this.description = "";

            if ("created" in sdo) {
                if (typeof(sdo.created) === "string") this.created = new Date(sdo.created);
                else logger.error("TypeError: created field is not a string:", sdo.created, "(",typeof(sdo.created),")")
            } else this.created = new Date();

            if ("created_by_ref" in sdo) {
                if (typeof(sdo.created) === "string") this.created_by_ref = sdo.created_by_ref
                else logger.error("TypeError: created_by_Ref field is not a string:", sdo.created_by_ref, "(",typeof(sdo.created_by_ref),")")
            }

            if ("modified" in sdo) {
                if (typeof(sdo.modified) === "string") this.modified = new Date(sdo.modified);
                else logger.error("TypeError: modified field is not a string:", sdo.modified, "(",typeof(sdo.modified),")")
            }
            else if ("type" in sdo && sdo.type != "marking-definition") this.modified = new Date();

            if ("x_mitre_modified_by_ref" in sdo) {
                if (typeof(sdo.created) === "string") this.modified_by_ref = sdo.x_mitre_modified_by_ref;
                else logger.error("TypeError: x_mitre_modified_by_ref field is not a string:", sdo.x_mitre_modified_by_ref, "(",typeof(sdo.x_mitre_modified_by_ref),")")
            }

            if ("x_mitre_version" in sdo) {
                if (typeof(sdo.x_mitre_version) === "string") this.version = new VersionNumber(sdo.x_mitre_version);
                else logger.error("TypeError: x_mitre_version field is not a string:", sdo.x_mitre_version, "(",typeof(sdo.x_mitre_version),")")
            } else this.version = new VersionNumber("0.1");

            if ("external_references" in sdo) {
                if (typeof(sdo.external_references) === "object") {
                    this.external_references = new ExternalReferences(sdo.external_references);
                    if (sdo.external_references.length > 0 && this.type != "relationship" && sdo.external_references[0].hasOwnProperty("external_id")) {
                        if (typeof(sdo.external_references[0].external_id) === "string") this.attackID = sdo.external_references[0].external_id;
                        else logger.error("TypeError: attackID field is not a string:", sdo.external_references[0].external_id, "(",typeof(sdo.external_references[0].external_id),")")
                    }
                    else this.attackID = "";
                }
                else logger.error("TypeError: external_references field is not an object:", sdo.external_references, "(",typeof(sdo.external_references),")")
            }
            else {
                this.external_references = new ExternalReferences();
                this.attackID = "";
            }

            if ("x_mitre_deprecated" in sdo) {
                if (typeof(sdo.x_mitre_deprecated) === "boolean") this.deprecated = sdo.x_mitre_deprecated;
                else logger.error("TypeError: x_mitre_deprecated field is not a boolean:", sdo.x_mitre_deprecated, "(",typeof(sdo.x_mitre_deprecated),")")
            }
            if ("revoked" in sdo) {
                if (typeof(sdo.revoked) === "boolean") this.revoked = sdo.revoked;
                else logger.error("TypeError: revoked field is not a boolean:", sdo.revoked, "(",typeof(sdo.revoked),")")
            }
        }
        else logger.error("ObjectError: 'stix' field does not exist in object");

        if ("created_by_identity" in raw && raw.created_by_identity) {
            let identityData = raw.created_by_identity;
            if ("stix" in identityData) {
                this.created_by = identityData.stix;
            } else logger.error("ObjectError: 'stix' field does not exist in created_by_identity object");
        }
        if ("modified_by_identity" in raw && raw.modified_by_identity) {
            let identityData = raw.modified_by_identity;
            if ("stix" in identityData) {
                this.modified_by = identityData.stix;
            } else logger.error("ObjectError: 'stix' field does not exist in modified_by_identity object");
        }

        if ("workspace" in raw) {
            // parse workspace fields
            let workspaceData = raw.workspace;
            if ("workflow" in workspaceData) {
                if (typeof(workspaceData.workflow) == "object") {
                    this.workflow = workspaceData.workflow;
                } else logger.error("TypeError: workflow field is not an object", workspaceData)
            }
        }
    }

    /**
     * Validate the current object state and return information on the result of the validation
     * @abstract
     * @param {RestApiConnectorService} restAPIService: the REST API connector through which asynchronous validation can be completed
     * @returns {Observable<ValidationData>} the validation warnings and errors once validation is complete.
     */
    public base_validate(restAPIService: RestApiConnectorService): Observable<ValidationData> {
        let validation = new ValidationData();

        // test version number format
        if (!this.version.valid()) {
            validation.errors.push({
                result: "error",
                field: "version",
                message: "version number is not formatted properly"
            })
        }
        // check any asynchronous validators
        return of(validation).pipe(
            // check if the name is unique if it has a name
            switchMap(result => {
                //do not check name or attackID for relationships or marking definitions
                if (this.attackType == "relationship" || this.attackType == "marking-definition") return of(result);
                // check if name & ATT&CK ID is unique, record result in validation, and return validation
                let accessor = this.attackType == "collection"? restAPIService.getAllCollections() :
                                this.attackType == "group"? restAPIService.getAllGroups() :
                                this.attackType == "software"? restAPIService.getAllSoftware() :
                                this.attackType == "matrix"? restAPIService.getAllMatrices() :
                                this.attackType == "mitigation"? restAPIService.getAllMitigations() :
                                this.attackType == "technique"? restAPIService.getAllTechniques() :
                                this.attackType == "data-source"? restAPIService.getAllDataSources() :
                                this.attackType == "data-component"? restAPIService.getAllDataComponents() :
                                restAPIService.getAllTactics();
                return accessor.pipe(
                    map(objects => {
                        // check name
                        if (this.hasOwnProperty("name")) {
                            if (this["name"] == "") {
                                result.errors.push({
                                    "result": "error",
                                    "field": "name",
                                    "message": "object has no name"
                                })
                            } else if (objects.data.some(x => x["name"].toLowerCase() == this['name'].toLowerCase() && x.stixID != this.stixID)) {
                                result.warnings.push({
                                    "result": "warning",
                                    "field": "name",
                                    "message": "name is not unique"
                                })
                            } else {
                                result.successes.push({
                                    "result": "success",
                                    "field": "name",
                                    "message": "name is unique"
                                })
                            }
                        }
                        // check ATT&CK ID and ignore collections
                        if (this.hasOwnProperty("supportsAttackID") && this.supportsAttackID == true) {
                            if (this.attackID == "") {
                                result.warnings.push({
                                    "result": "warning",
                                    "field": "attackID",
                                    "message": "Object does not have ATT&CK ID"
                                })
                            } else {
                                if (objects.data.some(x => x.attackID == this.attackID && x.stixID != this.stixID)) {
                                    result.errors.push({
                                        "result": "error",
                                        "field": "attackID",
                                        "message": "ATT&CK ID is not unique"
                                    })
                                } else {
                                    result.successes.push({
                                        "result": "success",
                                        "field": "attackID",
                                        "message": "ATT&CK ID is unique"
                                    })
                                }
                                let idRegex = new RegExp("^([A-Z]+-)?" + this.attackIDValidator.regex + "$");
                                let attackIDValid = idRegex.test(this.attackID);
                                if (!attackIDValid) {
                                    result.errors.push({
                                        "result": "error",
                                        "field": "attackID",
                                        "message": `ATT&CK ID does not match the format ${this.attackIDValidator.format}`
                                    })
                                }
                            }
                        }
                        return result;
                    })
                )
            }), //end switchmap
            // validate external references
            switchMap(result => {
                // build list of fields to validate external references on according to ATT&CK type
                let refs_fields = ["description"];
                if (this.attackType == "software" || this.attackType == "group") refs_fields.push("aliases");
                if (this.attackType == "technique") refs_fields.push("detection");

                return this.external_references.validate(restAPIService, {object: this, fields: refs_fields}).pipe(
                    map(refs_result => {
                        result.merge(refs_result);
                        return result;
                    })
                )
            }),
            // validate 'revoked-by' relationship exists
            switchMap(result => {
                if (!this.revoked) return of(result); // do not check for revoked-by relationship

                let accessor = restAPIService.getRelatedTo({sourceRef: this.stixID});
                return accessor.pipe(
                    map(objects => {
                        if (!objects.data.find(relationship => relationship['relationship_type'] == 'revoked-by')) {
                            result.errors.push({
                                "result": "error",
                                "field": "revoked",
                                "message": "'revoked-by' relationship does not exist"
                            })
                        } else {
                            result.successes.push({
                                "result": "success",
                                "field": "revoked",
                                "message": "'revoked-by' relationship exists"
                            })
                        }
                        return result;
                    })
                )

            })
        ) //end pipe

    }

    public isStringArray = function(arr): boolean {
        for (let i = 0; i < arr.length; i++) {
            if (typeof(arr[i]) !== "string") {
                logger.error("TypeError:", arr[i], "(",typeof(arr[i]),")", "is not a string")
                return false;
            }
        }
        return true;
    }

    /**
     * Save the current state of the STIX object in the database. Update the current object from the response
     * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
     * @returns {Observable} of the post
     */
    abstract save(restAPIService: RestApiConnectorService): Observable<StixObject>;

    /**
     * Updates the object's marking definitions with the default the first time an object is created
     * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
     */
    public initializeWithDefaultMarkingDefinitions(restAPIService: RestApiConnectorService) {
        let data$ = restAPIService.getDefaultMarkingDefinitions();
        let sub = data$.subscribe({
            next: (data) => {
                let marking_refs = []
                for (let i in data) {
                    marking_refs.push(data[i].stix.id); // Select current statements by default
                }
                this.object_marking_refs = marking_refs;
                this.defaultMarkingDefinitionsLoaded = true;
            },
            complete: () => { sub.unsubscribe(); }
        });
    }

    public generateAttackIDWithPrefix(restAPIService?: RestApiConnectorService) {
      if (!this.firstInitialized || !this.supportsNamespace) return;
      let sub = this.getNamespaceID(restAPIService).subscribe({
        next: (val) => {
          this.attackID = val
        },
        complete: () => sub.unsubscribe()
      });
    }

    public getNamespaceID(restAPIConnector): Observable<any> {
      let prefix = ''; // i.e. 'PRE-T'
      let count = ''; // i.e. '1234'
      let copyID = this.attackID;
      this.attackID = '(generating ID)';
      return restAPIConnector.getOrganizationNamespace().pipe(
        map(namespaceSettings => namespaceSettings),
        switchMap(organizationNamespace => {
          if (organizationNamespace && organizationNamespace.hasOwnProperty('prefix')) {
            if (organizationNamespace['prefix']) prefix += (organizationNamespace['prefix'] + '-');
            count = organizationNamespace['range_start'];
            count = (Number(count) > 0 ? count : 1).toString().padStart(4, '0'); // make sure ID has 4 digits i.e. 0 -> 0001 (note: padStart() is unsupported in IE)
          }
          let accessor = this.attackType == "group" ? restAPIConnector.getAllGroups() :
                         this.attackType == "mitigation" ? restAPIConnector.getAllMitigations() :
                         this.attackType == "software" ? restAPIConnector.getAllSoftware() :
                         this.attackType == "tactic" ? restAPIConnector.getAllTactics() :
                         this.attackType == "technique" ? restAPIConnector.getAllTechniques() :
                         this.attackType == "data-source" ? restAPIConnector.getAllDataSources() :
                         this.attackType == "matrix" ? restAPIConnector.getAllMatrices() : null;
          // Find all other objects that have this prefix and range, and set ID to the most recent and unique ID possible
          if (accessor) {
            prefix += this.attackIDValidator.format.includes('#') ? this.attackIDValidator.format.split('#')[0] : '';
            return accessor.pipe(map((objects) => {
              let substr = prefix + count.substr(0,3); // i.e. look for 'PRE-T123x' matches
              let filtered = objects['data'].filter((obj) => obj.attackID.startsWith(substr));

              let reg = new RegExp("\\d{4}");
              filtered = filtered.sort((a, b,) => {
                a = a.attackID.match(reg);
                b = b.attackID.match(reg);
                return a[0] - b[0] // check which 4-digit ID is greater
              });

              let latest = filtered.pop().attackID.match(reg)[0];
              latest = Number(latest)
              count = (Number(count) > latest ? Number(count) + 1 : latest).toString().padStart(4, '0');

              // Generate next available ID (assumes user had already clicked generate once and that's why the attackID already exists)
              if (copyID && copyID.replace(/[A-Z]+-/i,'').endsWith(count)) {
                count = (Number(count) + 1).toString().padStart(4, '0');
              }

              if (this.hasOwnProperty('is_subtechnique') && this['is_subtechnique']) {
                if (this.hasOwnProperty('parentTechnique') && this['parentTechnique']) {
                  let children$ = restAPIConnector.getTechnique(this['parentTechnique'].stixID, null, "all");
                  if (children$) {
                    let sub = children$.subscribe({
                      next: t => {
                        if (t[0] && t[0].attackID) {
                          count = t[0].attackID.replace(/[A-Z]+-/, "").replace(/[A-Z]/, ''); // 'PRE-T1234' -> '1234'
                          count += '.01';
                          let reg = new RegExp("[.]\\d{2}");
                          let children = t[0].subTechniques;
                          if (children.length > 0) {
                            children = children.sort((a, b,) => {
                              a = a.attackID.match(reg);
                              b = b.attackID.match(reg);
                              return a[0] - b[0] // check which sub ID is greater
                            });
                            let latest = children.pop().attackID.match(reg)[0];
                            latest = Number(latest)
                            count = (Number(count) > latest ? Number(count) + .01 : latest).toString();
                            let [whole, fract] = count.split('.')
                            count = whole.padStart(4, '0') + fract;
                          }
                          // Manually setting attack ID here, since otherwise might hit return before subscription ends
                          this.attackID = prefix + count;
                        }

                      },
                      complete: () => { sub.unsubscribe() }
                    })
                  }

                }
                else return '(parent technique missing)';
              }

              return (prefix + count);
            }))
          }
          return of((prefix + count));
        })
      )
    }
}
