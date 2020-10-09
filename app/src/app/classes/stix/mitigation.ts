import {StixObject} from "./stix-object";

export class Mitigation extends StixObject {
    public name: string;
    public description: string;

    constructor(sdo?: any) {
        super(sdo, "course-of-action");
        if (sdo) {
            this.name = sdo.name;
            this.description = sdo.description;
        }
    }
}
