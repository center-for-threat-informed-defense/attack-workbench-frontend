import { StixObject } from "./stix-object";

export class Technique extends StixObject {
    public name: string;
    public description: string;
    public platforms: string[];

    constructor(sdo?: any) {
        super(sdo);
        if (sdo) {
            this.name = sdo.name;
            this.description = sdo.description;
            this.platforms = sdo["x_mitre_platforms"];
        }
    }
}