import {StixObject} from "./stix-object";
import { Relationship } from './relationship';

export class Group extends StixObject {
    public name: string;
    public description: string;
    public aliases: string[];
    public attackID: string;
    public contributors: string;
    

    constructor(sdo?: any) {
        super(sdo, "intrusion-set");
        if (sdo) {
            this.name = sdo.name;
            this.description = sdo.description;
            this.aliases = sdo.aliases ? sdo.aliases : [];
            this.attackID = sdo.external_references[0].external_id;
            this.contributors = sdo.x_mitre_contributors;
        }
    }
}