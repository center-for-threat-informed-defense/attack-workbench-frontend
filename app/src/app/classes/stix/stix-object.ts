import { Relationship } from './relationship';
import { VersionNumber } from '../version-number';
import { ExternalReferences } from '../external-references';
import { v4 as uuid } from 'uuid';
import { Serializable, ValidationData } from '../serializable';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export type workflowStates = "wip" | "awaiting review" | "reviewed"

export abstract class StixObject extends Serializable {
    public stixID: string; // STIX ID
    public type: string;   // STIX type
    public attackType: string; // ATT&CK type
    public attackID: string; // ATT&CK ID
    public description: string;

    private typeMap = {
        "x-mitre-collection": "collection",
        "attack-pattern": "technique",
        "malware": "software",
        "tool": "software",
        "intrusion-set": "group",
        "course-of-action": "mitigation",
        "x-mitre-matrix": "matrix",
        "x-mitre-tactic": "tactic",
        "relationship": "relationship"
    }

    private typeUrlMap = {
        "technique": "techniques",
        "software": "software",
        "group": "groups",
        "mitigation": "mitigations",
        "matrix": "matrices",
        "tactic": "tactics",
    }

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
        state: workflowStates
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
        } else {
            // create new SDO
            this.stixID = type + "--" + uuid();
            this.type = type;
            this.created = new Date();
            this.modified = new Date();
            this.version = new VersionNumber("0.1");
            this.attackID = "";
            this.external_references = new ExternalReferences();
            this.workflow = {
                state: "wip"
            };
            this.description = "";
        }
        this.attackType = this.typeMap[this.type]
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

        return {
            workspace:  {
                workflow: this.workflow
            },
            stix: {
                "type": this.type,
                "id": this.stixID,
                "created": this.created.toISOString(),
                "modified": this.modified.toISOString(),
                "x_mitre_version": this.version.toString(),
                "external_references": serialized_external_references,
                "x_mitre_deprecated": this.deprecated,
                "revoked": this.revoked,
                "description": this.description,
                "spec_version": "2.1"
            }
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
                else console.error("TypeError: id field is not a string:", sdo.id, "(",typeof(sdo.id),")")
            }

            if ("type" in sdo) {
                if (typeof(sdo.type) === "string") this.type = sdo.type;
                else console.error("TypeError: type field is not a string:", sdo.type, "(",typeof(sdo.type),")")
            }

            if ("description" in sdo) {
                if (typeof(sdo.description) === "string") this.description = sdo.description;
                else console.error("TypeError: description field is not a string:", sdo.description, "(",typeof(sdo.description),")")
            } else this.description = "";

            if ("created" in sdo) {
                if (typeof(sdo.created) === "string") this.created = new Date(sdo.created);
                else console.error("TypeError: created field is not a string:", sdo.created, "(",typeof(sdo.created),")")
            } else this.created = new Date();

            if ("modified" in sdo) {
                if (typeof(sdo.modified) === "string") this.modified = new Date(sdo.modified);
                else console.error("TypeError: modified field is not a string:", sdo.modified, "(",typeof(sdo.modified),")")
            } else this.modified = new Date();

            if ("x_mitre_version" in sdo) {
                if (typeof(sdo.x_mitre_version) === "string") this.version = new VersionNumber(sdo.x_mitre_version);
                else console.error("TypeError: x_mitre_version field is not a string:", sdo.x_mitre_version, "(",typeof(sdo.x_mitre_version),")")
            } else this.version = new VersionNumber("0.1");
    
            if ("external_references" in sdo) {
                if (typeof(sdo.external_references) === "object") {
                    this.external_references = new ExternalReferences(sdo.external_references);
                    if (sdo.external_references.length > 0 && this.type != "relationship") {
                        if (typeof(sdo.external_references[0].external_id) === "string") this.attackID = sdo.external_references[0].external_id;
                        else console.error("TypeError: attackID field is not a string:", sdo.external_references[0].external_id, "(",typeof(sdo.external_references[0].external_id),")")
                    }
                    else this.attackID = "";
                }
                else console.error("TypeError: external_references field is not an object:", sdo.external_references, "(",typeof(sdo.external_references),")")
            } 
            else {
                this.external_references = new ExternalReferences();
                this.attackID = "";
            }
        
            if ("x_mitre_deprecated" in sdo) {
                if (typeof(sdo.x_mitre_deprecated) === "boolean") this.deprecated = sdo.x_mitre_deprecated;
                else console.error("TypeError: x_mitre_deprecated field is not a boolean:", sdo.x_mitre_deprecated, "(",typeof(sdo.x_mitre_deprecated),")") 
            }
            if ("x_mitre_revoked" in sdo) {
                if (typeof(sdo.x_mitre_revoked) === "boolean") this.revoked = sdo.x_mitre_revoked;
                else console.error("TypeError: x_mitre_revoked field is not a boolean:", sdo.x_mitre_revoked, "(",typeof(sdo.x_mitre_revoked),")") 
            }
        }
        else console.error("ObjectError: 'stix' field does not exist in object");

        if ("workspace" in raw) {
            // parse workspace fields
            let workspaceData = raw.workspace;
            if ("workflow" in workspaceData) {
                if (typeof(workspaceData.workflow) == "object") {
                    this.workflow = workspaceData.workflow;
                } else console.error("TypeError: workflow field is not an object")
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
        // TODO: validate description for missing citation and linkByIDs
        // test version number format
        if (this.version.valid()) {
            validation.successes.push({
                result: "success",
                displayOnSuccess: false,
                field: "version",
                message: "version number is properly formatted"
            })
        } else {
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
                if (!this.hasOwnProperty("name")) {
                    return of(result);
                } else {
                    // check if name is unique, record result in validation, and return validation
                    let accessor = this.attackType == "collection"? restAPIService.getAllCollections() :
                                   this.attackType == "group"? restAPIService.getAllGroups() :
                                   this.attackType == "software"? restAPIService.getAllSoftware() :
                                   this.attackType == "matrix"? restAPIService.getAllMatrices() :
                                   this.attackType == "mitigation"? restAPIService.getAllMitigations() :
                                   this.attackType == "technique"? restAPIService.getAllTechniques() :
                                   restAPIService.getAllTactics(); 
                    return accessor.pipe(
                        map(objects => {
                            if (objects.data.some(x => x["name"] == this['name'])) {
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
                            return result;
                        })
                    )
                }
            })
            // TODO check if revoked-by exists if revoked?
        )

    }

    public isStringArray = function(arr): boolean {
        for (let i = 0; i < arr.length; i++) {
            if (typeof(arr[i]) !== "string") {
                console.error("TypeError:", arr[i], "(",typeof(arr[i]),")", "is not a string")
                return false;
            }
        }
        return true;
    }

    /**
     * Save the current state of the STIX object in the database. Update the current object from the response
     * @param new_version [boolean] if false, overwrite the current version of the object. If true, creates a new version.
     * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
     * @returns {Observable} of the post
     */
    abstract save(new_version: boolean, restAPIService: RestApiConnectorService): Observable<StixObject>;
}