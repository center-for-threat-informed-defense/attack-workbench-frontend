import { DisplaySettings } from '../display-settings';
import { StixObject } from './stix-object';

export class Collection extends StixObject {
    public name: string;
    public description: string;

    public get routes(): any[] { //override generic stixObject routes
        let baseRoute = "/" + [this.attackType, this.stixID].join("/")
        return [
            {
                "label": "view",
                "route": ""
            }, {
                "label": "draft a new release",
                "route": "/export"
            }, {
                "label": "update",
                "route": "/update"
            }
        ]
    }

    public displaySettings: DisplaySettings = { //setup display of technique
        tableColumns: [
            {
                "property": "name",
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
    
    public updateAvailable: boolean = false;

    constructor(sdo?: any) {
        super(sdo, "x-mitre-collection");
        if (sdo) {
            this.name = sdo.name;
            this.description = sdo.description;
        }
        
    }
}