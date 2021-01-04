import {StixObject} from "./stix-object";

export class Tactic extends StixObject {
    public name: string;
    public description: string;
    public attackID : string;
    public domains: string[];

    constructor(sdo?: any) {
        super(sdo, "x-mitre-tactic");
        if (sdo) {
            this.name = sdo.name;
            this.description = sdo.description;
            this.attackID = sdo.external_references[0].external_id;
            this.domains = sdo.x_mitre_domains;
        }
    }
}
