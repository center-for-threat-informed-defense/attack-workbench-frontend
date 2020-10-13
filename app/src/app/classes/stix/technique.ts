import { DisplaySettings } from '../display-settings';
import { StixObject } from "./stix-object";

export class Technique extends StixObject {
    public name: string;
    public description: string;
    public platforms: string[];

    constructor(sdo?: any) {
        super(sdo);
        if (sdo) {
            this.name = sdo.name;
            this.description = sdo.description;
            this.platforms = sdo["x_mitre_platforms"];
        }
    }
}


const techniqueDisplaySettings: DisplaySettings = { //configuration for display of techniques
    tableColumns: [
        {
            "property": "name",
            "display": "plain"
        },
        {
            "property": "platforms",
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
export {techniqueDisplaySettings};