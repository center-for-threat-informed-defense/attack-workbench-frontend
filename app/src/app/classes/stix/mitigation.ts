import {StixObject} from "./stix-object";

export class Mitigation extends StixObject {
    public name: string;
    public description: string;
    public domains: string[];

    constructor(sdo?: any) {
        super(sdo, "course-of-action");
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
        rep.stix.x_mitre_domains = this.domains;

        return JSON.stringify(rep);
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
            
            if ("x_mitre_domains" in sdo) {
                if (this.isStringArray(sdo.x_mitre_domains)) this.domains = sdo.x_mitre_domains;
                else console.error("TypeError: domains field is not a string array.");
            } else this.domains = [];
        }
    }
}
