import {StixObject} from "./stix-object";

export class Relationship extends StixObject {

    public readonly source_ref: string;
    public source_name: string = "[unknown object]";
    public source_ID: string;

    public readonly target_ref: string;
    public target_name: string = "[unknown object]";
    public target_ID: string;
    
    public readonly relationship_type: string;
    public description: string;

    constructor(sdo?: any) {
        super(sdo, "relationship");
        if (sdo) {
            if ("stix" in sdo) {
                let sdoStix = sdo.stix;

                // Initialize read only values in constructor
                if ("source_ref" in sdoStix) {
                    if (typeof(sdoStix.source_ref) === "string") this.source_ref = sdoStix.source_ref;
                    else console.error("TypeError: source_ref field is not a string:", sdoStix.source_ref, "(",typeof(sdoStix.source_ref),")")
                }
                if ("target_ref" in sdoStix) {
                    if (typeof(sdoStix.target_ref) === "string") this.target_ref = sdoStix.target_ref;
                    else console.error("TypeError: target_ref field is not a string:", sdoStix.target_ref, "(",typeof(sdoStix.target_ref),")")
                }
                if ("relationship_type" in sdoStix) {
                    if (typeof(sdoStix.relationship_type) === "string") this.relationship_type = sdoStix.relationship_type;
                    else console.error("TypeError: relationship_type field is not a string:", sdoStix.relationship_type, "(",typeof(sdoStix.relationship_type),")")
                }
                this.deserialize(sdo);
            }
        }
    }

    public serialize(): any {};

    /**
     * Parse the object from the record returned from the back-end
     * @abstract
     * @param {*} raw the raw object to parse
     */
    public deserialize(raw: any) {
        if ("stix" in raw) {
            let sdo = raw.stix;

            if ("description" in sdo) {
                if (typeof(sdo.description) === "string") this.description = sdo.description;
                else console.error("TypeError: description field is not a string:", sdo.description, "(",typeof(sdo.description),")")
            } else this.description = "";

        }

        if ("source_object" in raw) {
            this.source_name = raw.source_object.stix.name;
            
            let src_sdo = raw.source_object.stix;
            if ("external_references" in src_sdo) {
                if (src_sdo.external_references.length > 0) {
                    if (typeof(src_sdo.external_references[0].external_id) === "string") this.source_ID = src_sdo.external_references[0].external_id;
                    else console.error("TypeError: attackID field is not a string:", src_sdo.external_references[0].external_id, "(", typeof(src_sdo.external_references[0].external_id), ")");
                }
                else console.error("ObjectError: external references is empty");
            } else this.source_ID = "";
        }
        if ("target_object" in raw) {
            this.target_name = raw.target_object.stix.name;

            let tgt_sdo = raw.target_object.stix;
            if ("external_references" in tgt_sdo) {
                if (tgt_sdo.external_references.length > 0) {
                    if (typeof(tgt_sdo.external_references[0].external_id) === "string") this.target_ID = tgt_sdo.external_references[0].external_id;
                    else console.error("TypeError: attackID field is not a string:", tgt_sdo.external_references[0].external_id, "(", typeof(tgt_sdo.external_references[0].external_id), ")");
                }
                else console.error("ObjectError: external references is empty");
            } else this.target_ID = "";
        }
    }
    
    /**
     * Get the source object
     */
    public getSourceObject(): StixObject {
        return null;
    }
    /**
     * Get the target object
     */
    public getTargetObject(): StixObject {
        return null;
    }
}
