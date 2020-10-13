import {StixObject} from "./stix-object";
import { Relationship } from './relationship';
import { DisplaySettings } from '../display-settings';

export class Group extends StixObject {
    public name: string;
    public description: string;
    public aliases: string[];

    

    constructor(sdo?: any) {
        super(sdo, "intrusion-set");
        if (sdo) {
            this.name = sdo.name;
            this.description = sdo.description;
            this.aliases = sdo.aliases;
        }
    }

}

const groupDisplaySettings: DisplaySettings = { //configuration for display of groups
    tableColumns: [
        {
            "property": "name",
            "display": "plain"
        },
        {
            "property": "aliases",
            "display": "tags"
        },
        {
            "property": "version",
            "display": "plain"
        },
        {
            "property": "modified",
            "display": "date"
        }
    ],
    tableDetail: [
        {
            "property": "description",
            "display": "descriptive"
        }
    ],
    viewCard: [

    ],
    viewMain: [

    ]
}
export {groupDisplaySettings};