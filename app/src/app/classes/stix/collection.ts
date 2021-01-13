import { StixObject } from './stix-object';

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
    public import_categories: {
        additions: string[], //new objects that didn't exist locally prior to the import
        changes: string[], //changes to objects that already existed locally
        deprecations: string[], //objects that are now deprecated but weren't before
        minor_changes: string[], //objects which are changed without version number increments
        revocations: string[], //objects which are now revoked but weren't before
        supersedes_collection_changes: string[], //objects which have a conflict where user edits supersede the collection object-version
        supersedes_user_edits: string[] //objects which have a conflict where they overwrite user changes
    }

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
    }
}