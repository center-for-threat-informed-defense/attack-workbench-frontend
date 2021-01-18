import { StixObject } from './stix-object';

/**
 * 
 * 
 */

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
        this.object_ref = raw.object_ref;
        this.object_modified = new Date(raw.object_modified);
    }
}   

export class Collection extends StixObject {
    public name: string;
    public description: string;
    public contents: VersionReference[] = [];
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

    public serialize() {

    }

    public deserialize(raw: any) {
        this.name = raw.stix.name;
        this.description = raw.stix.description;
        if ("x_mitre_contents" in raw.stix) this.contents = raw.stix.x_mitre_contents.map(vr => new VersionReference(vr))
        this.imported = new Date(raw.workspace.imported);
        this.import_categories = raw.workspace.import_categories;
        // randomly assign objects to different categories
        // let categories = Object.keys(this.import_categories);
        // for (let vr of this.contents) {
        //     let category = categories[ categories.length * Math.random() << 0];
        //     this.import_categories[category].push(vr.object_ref)
        // }
    }
}