import { StixObject } from "./stix-object";

export class Technique extends StixObject {
    public name: string;
    public description: string;
    public platforms: string[];

    constructor(sdo?: any) {
        super(sdo["stix"]);
        if (sdo) {
            this.name = sdo["stix"].name;
            this.description = sdo["stix"].description;
            this.platforms = sdo["stix"]["x_mitre_platforms"] ? sdo["stix"]["x_mitre_platforms"] : [];
        }
    }
    public serialize(): any {}
    public deserialize(raw: any) {}
}