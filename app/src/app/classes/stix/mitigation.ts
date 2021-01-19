import {StixObject} from "./stix-object";

export class Mitigation extends StixObject {
    public name: string;
    public description: string;
    public attackID: string;

    constructor(sdo?: any) {
        super(sdo["stix"], "course-of-action");
        if (sdo) {
            this.name = sdo["stix"].name;
            this.description = sdo["stix"].description;
            if (sdo["stix"].external_references.length > 0) this.attackID = sdo["stix"].external_references[0].external_id;
        }
    }

    public deserialize(raw: any) {}
    public serialize(): any {}
}
