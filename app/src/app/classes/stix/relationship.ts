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
            this.source_ref = sdo.stix.source_ref;
            this.target_ref = sdo.stix.target_ref;
            this.relationship_type = sdo.stix.relationship_type;
            this.description = sdo.stix.description;
            // THIS IS NOT PART OF THE SPEC, AND IS A PLACEHOLDER
            if (sdo.workspace.source_name) this.source_name = sdo.stix.source_name;
            if (sdo.workspace.target_name) this.target_name = sdo.stix.target_name;
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
