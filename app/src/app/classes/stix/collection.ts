import { Observable } from 'rxjs';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { ValidationData } from '../serializable';
import { Group } from './group';
import { Matrix } from './matrix';
import { Mitigation } from './mitigation';
import { Relationship } from './relationship';
import { Software } from './software';
import { StixObject } from './stix-object';
import { Tactic } from './tactic';
import { Technique } from './technique';
import { DataSource } from './data-source';
import { DataComponent } from './data-component';
import { logger } from "../../util/logger";
import { MarkingDefinition } from './marking-definition';

/**
 *auto-generated changelog/report about an import
 * each sub-property is a list of objects corresponding to objects in the import
 * @template T the type to record, typically a string for STIX IDs or a StixObject if the objects are being stratified directly
 */
export class CollectionDiffCategories<T> {
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

    /**
     * Add the given objects to the change list
     * If the objects are already in the list, the new version will overwrite the old
     * @param {T[]} objects the objects to add/update
     * @param {string} change_type the change type to add/update within
     */
    public add_objects(objects: T[], change_type: string) {
        // let objects_ids = new Set(objects.map(x=>x.stixID))
        // remove existing versions of the objects
        this.remove_objects(objects, change_type);
        // add updated versions of the objects
        this[change_type] = this[change_type].concat(objects);
    }

    /**
     * Remove the given objects from the change list
     * Only functions if T is a StixObject
     * @param {T[]} objects the objects to remove
     * @param {string} change_type the change type to remove from
     */
    public remove_objects(objects: T[], change_type: string) {
        let sdos = objects as unknown as StixObject[];
        let objects_ids = new Set(sdos.map(x=>x.stixID))
        this[change_type] = this[change_type].filter(x => !objects_ids.has(x.stixID))
    }

    /**
     * Check if the given object's ID occurs within the change type
     * Only functions if T is a StixObject
     * Note: doesn't check if objects are the same, so different versions of the same object would still return true
     * @param {T} object to check
     * @param {string} change_type to check
     * @returns true if the ID occurs on any object within the change type
     */
    public has_object(object: T, change_type: string) {
        let sdo = object as unknown as StixObject;
        return this[change_type].some(x=>x.stixID == sdo.stixID);
    }

    /**
     * Return all objects from all change types in a flat array
     * @param {boolean} include_nonchanges if true, include duplicates, out of date, supersedes and errors data, otherwise skips
     * @returns {T[]} all objects wtihin the change categories
     * @memberof CollectionDiffCategories
     */
    public flatten(include_nonchanges: boolean): T[] {
        let arrays = [
            this.additions,
            this.changes,
            this.minor_changes,
            this.deprecations,
            this.revocations
        ]
        if (include_nonchanges) arrays = arrays.concat([
            this.duplicates,
            this.out_of_date,
            this.supersedes_collection_changes,
            this.supersedes_user_edits,
            this.errors
        ])
        return [].concat(...arrays); //flatten
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
            else logger.error("TypeError: object_ref field is not a string:", sdo.object_ref, "(",typeof(sdo.object_ref),")")
        } else this.object_ref = "";

        if ("object_modified" in sdo) {
            if (typeof(sdo.object_modified) === "string") this.object_modified = new Date(sdo.object_modified);
            else logger.error("TypeError: object_modified field is not a string:", sdo.object_modified, "(",typeof(sdo.object_modified),")")
        } else this.object_modified = new Date();
    }
}

export class Collection extends StixObject {
    public name: string = "";
    public contents: VersionReference[] = []; //references to the stix objects in the collection
    public stix_contents: StixObject[] = []; //the actual objects in the collection
    public imported: Date; // null if it was not imported
    public release: boolean = false; // was this collection version release?
    public editable: boolean = true; //internal field; set to false to disallow editing of this collection
     // auto-generated changelog/report about the import
    //  each sub-property is a list of STIX IDs corresponding to objects in the import
    public import_categories: CollectionDiffCategories<string>;
    
    public readonly supportsAttackID = false; // collections do not support ATT&CK IDs
    protected get attackIDValidator() { return null; } //collections do not have ATT&CK IDs

    constructor(sdo?: any) {
        super(sdo, "x-mitre-collection");
        if (sdo) {
            this.deserialize(sdo);
        }
    }

    /**
     * Overload routes since collections use modified date as well
     */
    public get routes(): any {
        let routes: any = [{
            "label": "view",
            "route": "modified/" + this.modified.toISOString()
        }]
        if (!this.imported && this.editable) {
            routes.push({
                "label": "edit",
                "route": "modified/" + this.modified.toISOString(),
                "query": {"editing": true}
            })
        }
        return routes;
    }

    /**
     * Transform the current object into a raw object for sending to the back-end, stripping any unnecessary fields
     * @abstract
     * @returns {*} the raw object to send
     */
    public serialize(): any {
        let rep = super.base_serialize();
        
        rep.stix.name = this.name;
        rep.stix.x_mitre_contents = this.contents.map(vr => vr.serialize());
        // add release marking
        if (!rep.workspace.hasOwnProperty("workflow") || !rep.workspace.workflow) {
            rep.workspace.workflow = {};
        }
        rep.workspace.workflow.release = this.release;
        // add import/categories
        if (this.imported) rep.workspace.imported = this.imported.toString();
        if (this.import_categories) rep.workspace.import_categories = this.import_categories;
        // rep.contents = this.stix_contents.map(stix_objects => stix_objects.serialize());

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
                else logger.error("TypeError: name field is not a string:", sdo.name, "(",typeof(sdo.name),")")
            } else this.name = "";

            if ("x_mitre_contents" in sdo) {            
                if (typeof(sdo.x_mitre_contents) === "object") this.contents = sdo.x_mitre_contents.map(vr => new VersionReference(vr))
                else logger.error("TypeError: x_mitre_contents field is not an object:", sdo.x_mitre_contents, "(",typeof(sdo.x_mitre_contents),")")
            }
        }
        else logger.error("ObjectError: 'stix' field does not exist in object");

        if ("workspace" in raw) {
            let sdo = raw.workspace;

            if ("imported" in sdo) {
                if (typeof(sdo.imported) === "string") this.imported = new Date(sdo.imported);
                else logger.error("TypeError: imported field is not a string:", sdo.imported, "(",typeof(sdo.imported),")")
            }

            if ("workflow" in sdo && "release" in sdo.workflow) {
                if (typeof(sdo.workflow.release) === "boolean") this.release = sdo.workflow.release;
                else logger.error("TypeError: release field is not a boolean:", sdo.workflow.release, "(",typeof(sdo.workflow.release),")")
            }

            if ("import_categories" in sdo) {
                if (typeof(sdo.import_categories) === "object") this.import_categories = sdo.import_categories;
                else logger.error("TypeError: import_categories field is not an object:", sdo.import_categories, "(",typeof(sdo.import_categories),")")
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
                    case "x-mitre-data-source": // data source
                        this.stix_contents.push(new DataSource(obj))
                    break;
                    case "x-mitre-data-component": // data component
                        this.stix_contents.push(new DataComponent(obj))
                    break;
                    case "marking-definition": // marking definition
                        this.stix_contents.push(new MarkingDefinition(obj))
                    break;
                }
            }
        }
    }
    /**
     * Compare the two collections and return a set of CollectionDiffCategories for each type of object in the difference
     * @param {Collection} that
     * @memberof Collection
     */
    public compareTo(that: Collection): { 
        technique:      CollectionDiffCategories<Technique>,
        tactic:         CollectionDiffCategories<Tactic>,
        software:       CollectionDiffCategories<Software>,
        relationship:   CollectionDiffCategories<Relationship>,
        mitigation:     CollectionDiffCategories<Mitigation>,
        matrix:         CollectionDiffCategories<Matrix>,
        group:          CollectionDiffCategories<Group>,
        data_source:    CollectionDiffCategories<DataSource>,
        data_component: CollectionDiffCategories<DataComponent>
        marking_definition: CollectionDiffCategories<MarkingDefinition>
    } {
        let results = {
            technique:      new CollectionDiffCategories<Technique>(),
            tactic:         new CollectionDiffCategories<Tactic>(),
            software:       new CollectionDiffCategories<Software>(),
            relationship:   new CollectionDiffCategories<Relationship>(),
            mitigation:     new CollectionDiffCategories<Mitigation>(),
            matrix:         new CollectionDiffCategories<Matrix>(),
            group:          new CollectionDiffCategories<Group>(),
            data_source:    new CollectionDiffCategories<DataSource>(),
            data_component: new CollectionDiffCategories<DataComponent>(),
            marking_definition: new CollectionDiffCategories<MarkingDefinition>()
        }
        // build helper lookups to reduce complexity from n^2 to n.
        let thisStixLookup = new Map<string, StixObject>(this.stix_contents.map(sdo => [sdo.stixID, sdo]))
        let thatStixLookup = new Map<string, StixObject>(that.stix_contents.map(sdo => [sdo.stixID, sdo]))

        for (let thisVr of this.contents) {
            let thisAttackObject = thisStixLookup.get(thisVr.object_ref);
            if (!thisAttackObject) {
                // logger.warn("could not find object", thisVr.object_ref, "in collection contents")
                continue;
            }
            if (that.contents.find(thatVr => thisVr.object_ref == thatVr.object_ref)) {
                // object exists in other collection
                let thatAttackObject = thatStixLookup.get(thisVr.object_ref);
                if (!thatAttackObject) {
                    // logger.warn("could not find object", thisVr.object_ref, "in collection contents")
                    continue;
                }
                // determine if there was a change, and if so what type it was
                if (thatAttackObject.modified.toISOString() == thisAttackObject.modified.toISOString()) {
                    // not a change
                    results[thisAttackObject.attackType].duplicates.push(thisAttackObject);
                } else {
                    // was a change
                    // check if it was revoked
                    if (thisAttackObject.revoked && !thatAttackObject.revoked) {
                        // was revoked in the new and note in old
                        results[thisAttackObject.attackType].revocations.push(thisAttackObject);
                    } else if (thisAttackObject.deprecated && !thatAttackObject.deprecated) { 
                        // was deprecated in new and not in old
                        results[thisAttackObject.attackType].deprecations.push(thisAttackObject);
                    } else if (thisAttackObject.version.compareTo(thatAttackObject.version) != 0) {
                        // version number incremented/decremented
                        results[thisAttackObject.attackType].changes.push(thisAttackObject);
                    } else {
                        // minor change
                        results[thisAttackObject.attackType].minor_changes.push(thisAttackObject);
                    }
                } 
            } else {
                // object does not exist in other collection, was added
                results[thisAttackObject.attackType.replace("-","_")].additions.push(thisAttackObject);
            }
        }
        return results;
    }

    /**
     * Validate the current object state and return information on the result of the validation
     * @param {RestApiConnectorService} restAPIService: the REST API connector through which asynchronous validation can be completed
     * @returns {Observable<ValidationData>} the validation warnings and errors once validation is complete.
     */
    public validate(restAPIService: RestApiConnectorService): Observable<ValidationData> {
        return this.base_validate(restAPIService);
    }
    
    /**
     * Save the current state of the STIX object in the database. Update the current object from the response
     * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
     * @returns {Observable} of the post
     */
    public save(restAPIService: RestApiConnectorService): Observable<Collection> {
        let postObservable = restAPIService.postCollection(this);
        let subscription = postObservable.subscribe({
            next: (result) => { this.deserialize(result.serialize()); },
            complete: () => { subscription.unsubscribe(); }
        })
        return postObservable;
    }
}