import { Observable } from 'rxjs';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { Group } from './group';
import { Matrix } from './matrix';
import { Mitigation } from './mitigation';
import { Relationship } from './relationship';
import { Software } from './software';
import { StixObject } from './stix-object';
import { Tactic } from './tactic';
import { Technique } from './technique';


/**
 *auto-generated changelog/report about an import
 * each sub-property is a list of objects corresponding to objects in the import
 * @template T the type to record, typically a string for STIX IDs or a StixObject if the objects are being stratified directly
 */
export class CollectionImportCategories<T> {
    additions: T[] = []; //new objects that didn't exist locally prior to the import
    changes: T[] = []; //changes to objects that already existed locally
    minor_changes: T[] = []; //objects which are changed without version number increments
    duplicates: T[] = []; //objects with the same STIX ID and modified date as the contents of the knowledge base

    deprecations: T[] = []; //objects that are now deprecated but weren't before
    revocations: T[] = []; //objects which are now revoked but weren't before
    
    out_of_date: T[] = []; //object with the same STIX ID exists with a newer modified date, but it was modified by the same identity and is therefore not a supersede
    supersedes_collection_changes: T[] = []; //objects which have a conflict where user edits supersede the collection object-version
    supersedes_user_edits: T[] = []; //objects which have a conflict where they overwrite user changes
    errors: T[] = []; //an error occurred while looking up existing objects with the same stixId, probably shouldn't ever occur unless something has gone really wrong
    
    /**
     * get the number of objects recorded in the categories
     */
    public get object_count() { 
        return this.additions.length +
               this.changes.length +
               this.minor_changes.length +
               this.duplicates.length + 

               this.deprecations.length +
               this.revocations.length +

               this.out_of_date.length +
               this.supersedes_collection_changes.length +
               this.supersedes_user_edits.length +
               this.errors.length;
    }
}

export class VersionReference {
    public object_ref: string;
    public object_modified: Date;
    constructor(raw: any) {
        if (raw) {
            this.deserialize(raw);
        }
    }

    /**
     * Transform the current object into a raw object for sending to the back-end, stripping any unnecessary fields
     * @abstract
     * @returns {*} the raw object to send
     */
    public serialize(): any {
        return {
            "object_ref": this.object_ref,
            "object_modified": this.object_modified.toISOString()
        }
    }

    /**
     * Parse the object from the record returned from the back-end
     * @abstract
     * @param {*} raw the raw object to parse
     */
    public deserialize(raw: any) {
        let sdo = raw;

        if ("object_ref" in sdo) {
            if (typeof(sdo.object_ref) === "string") this.object_ref = sdo.object_ref;
            else console.error("TypeError: object_ref field is not a string:", sdo.object_ref, "(",typeof(sdo.object_ref),")")
        } else this.object_ref = "";

        if ("object_modified" in sdo) {
            if (typeof(sdo.object_modified) === "string") this.object_modified = new Date(sdo.object_modified);
            else console.error("TypeError: object_modified field is not a string:", sdo.object_modified, "(",typeof(sdo.object_modified),")")
        } else this.object_modified = new Date();
    }
}

export class Collection extends StixObject {
    public name: string;
    public description: string;
    public contents: VersionReference[] = []; //references to the stix objects in the collection
    public stix_contents: StixObject[] = []; //the actual objects in the collection
    public imported: Date;
     // auto-generated changelog/report about the import
    //  each sub-property is a list of STIX IDs corresponding to objects in the import
    public import_categories: CollectionImportCategories<string>;

    constructor(sdo?: any) {
        super(sdo, "x-mitre-collection");
        if (sdo) {
            this.deserialize(sdo);
        }
    }

    /**
     * Transform the current object into a raw object for sending to the back-end, stripping any unnecessary fields
     * @abstract
     * @returns {*} the raw object to send
     */
    public serialize(): any {
        let rep: {[k: string]: any } = {};

        rep.stix = super.base_serialize();
        rep.stix.name = this.name;
        rep.stix.description = this.description;
        rep.stix.x_mitre_contents = this.contents.map(vr => vr.serialize());

        rep.workspace = {};
        rep.workspace.imported = this.imported.toString();
        rep.workspace.import_categories = this.import_categories;

        rep.contents = this.stix_contents.map(stix_objects => stix_objects.serialize());

        return rep;
    }

    /**
     * Parse the object from the record returned from the back-end
     * @abstract
     * @param {*} raw the raw object to parse
     */
    public deserialize(raw: any) {
        if ("stix" in raw) {
            let sdo = raw.stix;

            if ("name" in sdo) {
                if (typeof(sdo.name) === "string") this.name = sdo.name;
                else console.error("TypeError: name field is not a string:", sdo.name, "(",typeof(sdo.name),")")
            } else this.name = "";

            if ("description" in sdo) {
                if (typeof(sdo.description) === "string") this.description = sdo.description;
                else console.error("TypeError: description field is not a string:", sdo.description, "(",typeof(sdo.description),")")
            } else this.description = "";

            if ("x_mitre_contents" in sdo) {            
                if (typeof(sdo.x_mitre_contents) === "object") this.contents = sdo.x_mitre_contents.map(vr => new VersionReference(vr))
                else console.error("TypeError: x_mitre_contents field is not an object:", sdo.x_mitre_contents, "(",typeof(sdo.x_mitre_contents),")")
            }
        }
        else console.error("ObjectError: 'stix' field does not exist in object");

        if ("workspace" in raw) {
            let sdo = raw.workspace;

            if ("imported" in sdo) {
                if (typeof(sdo.imported) === "string") this.imported = new Date(sdo.imported);
                else console.error("TypeError: imported field is not a string:", sdo.imported, "(",typeof(sdo.imported),")")
            } else this.imported = new Date();

            if ("import_categories" in sdo) {
                if (typeof(sdo.import_categories) === "object") this.import_categories = sdo.import_categories;
                else console.error("TypeError: import_categories field is not an object:", sdo.import_categories, "(",typeof(sdo.import_categories),")")
            }
        }
        if ("contents" in raw) {
            for (let obj of raw.contents) {
                // deserialize contents into stix objects
                switch (obj.stix.type) {
                    case "attack-pattern": //technique
                        this.stix_contents.push(new Technique(obj))
                    break;
                    case "x-mitre-tactic": //tactic
                        this.stix_contents.push(new Tactic(obj))
                    break;
                    case "malware": //software
                    case "tool": 
                        this.stix_contents.push(new Software(obj.type, obj))
                    break;
                    case "relationship": //relationship
                        this.stix_contents.push(new Relationship(obj))
                    break;
                    case "course-of-action": //mitigation
                        this.stix_contents.push(new Mitigation(obj))
                    break;
                    case "x-mitre-matrix": //matrix
                        this.stix_contents.push(new Matrix(obj))
                    break;
                    case "intrusion-set": //group
                        this.stix_contents.push(new Group(obj))
                    break;
                }
            }
        }
    }
    /**
     * Save the current state of the STIX object in the database. Update the current object from the response
     * @param new_version [boolean] if false, overwrite the current version of the object. If true, creates a new version.
     * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
     * @returns {Observable} of the post
     */
    public save(new_version: boolean = true, restAPIService: RestApiConnectorService): Observable<Collection> {
        // TODO
        return null;
    }
}