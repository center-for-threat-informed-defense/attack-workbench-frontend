import {StixObject} from "./stix-object";

type type_software = "malware" | "tool"
export class Software extends StixObject {
    public name: string;
    public description: string;
    public platforms: string[];
    public attackID: string;

    constructor(type: type_software, sdo?: any) {
        super(sdo, type);
        if (sdo) {
            this.name = sdo.name;
            this.description = sdo.description;
            this.platforms = sdo.x_mitre_platforms;
            this.attackID = sdo.external_references[0].external_id;
        }
    }
    public deserialize(raw: any) {}
    public serialize(): any {}
}