import {StixObject} from "./stix-object";

export class Tactic extends StixObject {
    public name: string;
    public description: string;
    public attackID : string;
    public domains: string[];

    constructor(sdo?: any) {
        super(sdo["stix"], "x-mitre-tactic");
        if (sdo) {
            this.name = sdo["stix"].name;
            this.description = sdo["stix"].description;
            this.attackID = sdo["stix"].external_references.length > 0 ? sdo["stix"].external_references[0].external_id : "no ID";
            this.domains = sdo["workspace"].domains;
        }
    }
}
