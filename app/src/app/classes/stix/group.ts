import {StixObject} from "./stix-object";
import { Relationship } from './relationship';

export class Group extends StixObject {
    public name: string;
    public description: string;
    public aliases: string[];
    public attackID: string;
    public contributors: string;

    constructor(sdo?: any) {
        super(sdo.stix, "intrusion-set");
        if (sdo) {
            this.name = sdo.stix.name;
            this.description = sdo.stix.description;
            this.aliases = sdo.stix.aliases ? sdo.stix.aliases : [];
            if (sdo.stix.external_references.length > 0) this.attackID = sdo.stix.external_references[0].external_id;
            this.contributors = sdo.stix.x_mitre_contributors;
        }
    }
}