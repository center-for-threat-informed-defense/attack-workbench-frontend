import {StixObject} from "./stix-object";

export class Matrix extends StixObject {
    public name: string;
    public description: string;

    constructor(sdo?: any) {
        super(sdo, "x-mitre-matrix");
        if (sdo) {
            this.name = sdo.name;
            this.description = sdo.description;
        }
    }
    public serialize(): any {}
    public deserialize(raw: any) {}
}
