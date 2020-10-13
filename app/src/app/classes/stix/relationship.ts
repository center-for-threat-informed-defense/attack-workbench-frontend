import {StixObject} from "./stix-object";

export class Relationship extends StixObject {
    public readonly source_ref: string;
    public readonly target_ref: string;
    public readonly relationship_type: string;
    public description: string;
    constructor(sdo?: any) {
        super(sdo, "relationship");
        if (sdo) {
            this.source_ref = sdo.source_ref;
            this.target_ref = sdo.target_ref;
            this.relationship_type = sdo.relationship_type;
            this.description = sdo.description;
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
