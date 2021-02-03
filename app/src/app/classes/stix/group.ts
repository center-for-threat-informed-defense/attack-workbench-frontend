import {StixObject} from "./stix-object";
import { Relationship } from './relationship';

export class Group extends StixObject {
    public name: string = "";
    public description: string = "";
    public aliases: string[] = [];
    public attackID: string = "";
    public contributors: string[] = [];

    constructor(sdo?: any) {
        super(sdo, "intrusion-set");
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
        rep.stix.aliases = this.aliases;
        rep.stix.x_mitre_contributors = this.contributors;

        if (this.attackID) {
            let new_ext_ref = {
                "source_name": "mitre-attack",
                "external_id": this.attackID,
                "url": "https://attack.mitre.org/groups/" + this.attackID
            }
            rep.stix.external_references.unshift(new_ext_ref);
        }

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
            
            if ("aliases" in sdo) {
                if (this.isStringArray(sdo.aliases)) this.aliases = sdo.aliases;
                else console.error("TypeError: aliases is not a string array:", sdo.aliases, "(",typeof(sdo.aliases),")")
            } else this.aliases = [];

            if ("x_mitre_contributors" in sdo) {
                if (this.isStringArray(sdo.x_mitre_contributors)) this.contributors = sdo.x_mitre_contributors;
                else console.error("TypeError: x_mitre_contributors is not a string array:", sdo.x_mitre_contributors, "(",typeof(sdo.x_mitre_contributors),")")
            } else this.contributors = [];
        }
    }
}