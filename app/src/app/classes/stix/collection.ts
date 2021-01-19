import { StixObject } from './stix-object';

export class VersionReference {
    public object_ref: string;
    public object_modified: Date;
    constructor(raw: any) {
        if (raw) {
            this.deserialize(raw);
        }
    }

    /**
     * Parse the object from the record returned from the back-end
     * @abstract
     * @param {*} raw the raw object to parse
     */
    public deserialize(raw: any) {
        if ("stix" in raw) {
            let sdo = raw.stix;

            if ("object_ref" in sdo) {
                if (typeof(sdo.object_ref) === "string") this.object_ref = sdo.object_ref;
                else console.error("TypeError: object_ref field is not a string:", sdo.object_ref, "(",typeof(sdo.object_ref),")")
            } else this.object_ref = "";

            if ("object_modified" in sdo) {
                if (typeof(sdo.object_modified) === "string") this.object_modified = new Date(sdo.object_modified);
                else console.error("TypeError: object_modified field is not a string:", sdo.object_modified, "(",typeof(sdo.object_modified),")")
            } else this.object_modified = new Date();
        }
        else console.error("ObjectError: 'stix' field does not exist in object");
    }
}

export class Collection extends StixObject {
    public name: string;
    public description: string;
    public contents: VersionReference;

    constructor(sdo?: any) {
        super(sdo, "x-mitre-collection");
        if (sdo) {
            this.deserialize(sdo);
        }
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
    }
}