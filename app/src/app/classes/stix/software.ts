import { DisplaySettings } from '../display-settings';
import {StixObject} from "./stix-object";

type type_software = "malware" | "tool"
export class Software extends StixObject {
    public name: string;
    public description: string;

    constructor(type: type_software, sdo?: any) {
        super(sdo, type);
        if (sdo) {
            this.name = sdo.name;
            this.description = sdo.description;
        }
    }
}

const softwareDisplaySettings: DisplaySettings = { //configuration for display of software
    tableColumns: [
        {
            "property": "name",
            "display": "plain"
        },
        {
            "property": "type",
            "display": "plain"
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

export {softwareDisplaySettings};