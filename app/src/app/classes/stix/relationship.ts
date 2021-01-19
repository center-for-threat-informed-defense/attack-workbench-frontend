import {StixObject} from "./stix-object";

export class Relationship extends StixObject {

    public readonly source_ref: string;
    public source_name: string = "[source name]"; // TODO
    public source_attackID: string = "[source ID]"; // TODO

    public readonly target_ref: string;
    public target_name: string = "[target name]"; // TODO
    public target_attackID: string = "[target ID]"; // TODO
    
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

    public serialize() {};

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

            // THIS IS NOT PART OF THE SPEC, AND IS A PLACEHOLDER
            if (sdo.workspace.source_name) this.source_name = sdo.workspace.source_name;
            if (sdo.workspace.target_name) this.target_name = sdo.workspace.target_name;
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
