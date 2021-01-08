import {StixObject} from "./stix-object";

type type_software = "malware" | "tool"
export class Software extends StixObject {
    public name: string;
    public description: string;
    public aliases: string[];
    public platforms: string[];
    public attackID: string;
    public type: string;
    public contributors: string;

    constructor(type: type_software, sdo?: any) {
        super(sdo, type);
        if (sdo) {
            this.name = sdo.name;
            this.description = sdo.description;
            this.aliases = sdo.x_mitre_aliases;
            // Remove first alias name which is the same as the software name
            this.aliases.shift();
            this.platforms = sdo.x_mitre_platforms;
            this.attackID = sdo.external_references[0].external_id;
            this.type = sdo.type;
            this.contributors = sdo.x_mitre_contributors;
        }
    }
}