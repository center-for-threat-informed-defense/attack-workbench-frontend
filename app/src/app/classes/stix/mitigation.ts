import {StixObject} from "./stix-object";

export class Mitigation extends StixObject {
    public name: string;
    public description: string;
    public attackID: string;

    constructor(sdo?: any) {
        super(sdo, "course-of-action");
        if (sdo) {
            this.name = sdo.name;
            this.description = sdo.description;
            this.attackID = sdo.external_references[0].external_id;
        }
    }

    public deserialize(raw: any) {}
    public serialize(): any {}
}
