import {StixObject} from "./stix-object";

type type_software = "malware" | "tool"
export class Software extends StixObject {
    public name: string;
    public description: string;
    public platforms: string[];
    public attackID: string;

    constructor(type: type_software, sdo?: any) {
        super(sdo["stix"], type);
        if (sdo) {
            this.name = sdo.stix.name;
            this.description = sdo.stix.description;
            this.platforms = sdo.stix.x_mitre_platforms;
            if (sdo.stix.external_references.length > 0) this.attackID = sdo.stix.external_references[0].external_id;
        }
    }
}