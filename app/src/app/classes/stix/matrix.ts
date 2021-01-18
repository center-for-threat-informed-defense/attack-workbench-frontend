import {StixObject} from "./stix-object";

export class Matrix extends StixObject {
    public name: string;
    public description: string;
    public attackID: string;
    public tactic_refs: string[];

    constructor(sdo?: any) {
        super(sdo, "x-mitre-matrix");
        if (sdo) {
            this.deserialize(sdo);
        }
    }

    public serialize(): any {}

    /**
     * Parse the object from the record returned from the back-end
     * @abstract
     * @param {*} raw the raw object to parse
     */
    public deserialize(raw: any) {
        let sdo = raw;

        if ("name" in sdo) {
            if (typeof(sdo.name) === "string") this.name = sdo.name;
            else console.error("TypeError: name field is not a string:", sdo.name, "(",typeof(sdo.name),")")
        }
        if ("name" in sdo) {
            if (typeof(sdo.description) === "string") this.description = sdo.description;
            else console.error("TypeError: description field is not a string:", sdo.description, "(",typeof(sdo.description),")")
        }
        if ("external_references" in sdo) {
            if(sdo.external_references.length > 0){
                if (typeof(sdo.external_references[0].external_id) === "string") this.attackID = sdo.external_references[0].external_id;
                else console.error("TypeError: attackID field is not a string:", sdo.external_references[0].external_id, "(",typeof(sdo.external_references[0].external_id),")")    
            }
            else console.error("ObjectError: external references is empty")
        }
        if ("tactic_refs" in sdo) {
            if (typeof(sdo.tactic_refs) === "object") this.tactic_refs = sdo.tactic_refs;
            else console.error("TypeError: tactic_refs field is not an object:", sdo.tactic_refs, "(",typeof(sdo.tactic_refs),")")
        }
    }
}
