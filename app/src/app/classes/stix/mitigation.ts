import {StixObject} from "./stix-object";

export class Mitigation extends StixObject {
    public name: string;
    public description: string;
    public attackID: string;
    public domains: string[];

    constructor(sdo?: any) {
        super(sdo, "course-of-action");
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
            
            if ("external_references" in sdo) {
                if (typeof(sdo.external_references) === "object") {
                    if (sdo.external_references.length > 0) {
                        if (typeof(sdo.external_references[0].external_id) === "string") this.attackID = sdo.external_references[0].external_id;
                        else console.error("TypeError: attackID field is not a string:", sdo.external_references[0].external_id, "(",typeof(sdo.external_references[0].external_id),")")
                    }
                    else this.attackID = "";
                }
                else console.error("ObjectError: external_references is empty or is not an object")
            } else this.attackID = "";
            
            if ("x_mitre_domains" in sdo) {
                if (this.isStringArray(sdo.x_mitre_domains)) this.domains = sdo.x_mitre_domains;
                else console.error("TypeError: domains field is not a string array.");
            } else this.domains = [];
        }
    }
}
