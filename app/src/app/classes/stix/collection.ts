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
    public contents: VersionReference;

    constructor(sdo?: any) {
        super(sdo, "x-mitre-collection");
        if (sdo) {
            this.name = sdo.name;
            this.description = sdo.description;
            this.contents = sdo.x_mitre_contents.map(vr => new VersionReference(vr))
        }
    }

    public deserialize(raw: any) {}
    public serialize(): any {}
}