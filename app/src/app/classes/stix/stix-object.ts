import { Relationship } from './relationship';
import { VersionNumber } from '../version-number';
import { ExternalReferences } from '../external-references';
import { v4 as uuid } from 'uuid';

export abstract class StixObject {
    public readonly stixID: string; // STIX ID
    public readonly type: string;   // STIX type
    public readonly attackType: string; // ATT&CK type
    

    public get routes(): any[] { // route to view the object
        let baseRoute = "/" + [this.attackType, this.stixID].join("/")
        return [
            {
                "label": "view",
                "route": ""
            }, {
                "label": "edit",
                "route": "/edit"
            }
        ]
    } 

    public readonly created: Date;  // object created date
    public readonly modified: Date; // object modified date
    public version: VersionNumber;  // version number of the object
    public external_references: ExternalReferences;

    public deprecated: boolean = false; //is object deprecated?
    public revoked: boolean = false;    //is object revoked?

    /**
     * Initialize the STIX object
     * @param sdo the STIX domain object to initialize data from
     */
    constructor(sdo?: any, type?: string) {
        if (sdo) {
            // initialize common fields from SDO
            this.stixID = sdo.id;
            this.type = sdo.type;
            
            this.created = new Date(sdo.created);
            this.modified = new Date(sdo.modified);
            this.version = new VersionNumber(sdo.x_mitre_version);
            this.external_references = new ExternalReferences(sdo["external_references"]);

            if ("x_mitre_deprecated" in sdo) this.deprecated = sdo.x_mitre_deprecated;
            if ("x_mitre_revoked" in sdo) this.revoked = sdo.x_mitre_revoked;
        } else {
            // create new SDO
            this.stixID = type + "--" + uuid();
            this.type = type;
            this.created = new Date();
            this.modified = new Date();
            this.version = new VersionNumber("1.0");
        }
        this.attackType = {
            "x-mitre-collection": "collection",
            "attack-pattern": "technique",
            "malware": "software",
            "tool": "software",
            "intrusion-set": "group",
            "course-of-action": "mitigation",
            "x-mitre-matrix": "matrix",
            "x-mitre-tactic": "tactic"
        }[this.type]
    }

    /**
     * Save the current state of the STIX object in the database
     */
    public save(): void {
        //TODO
    }


    /**
     * Get all relationships with this object
     * @param relationship_type optional, the relationship type to get. E.g "uses" or "mitigates"
     * @returns list of relationships
     */
    public getRelationships(relationship_type?: string): Relationship[] {
        return null; //TODO
    }

    /**
     * Get relationships from this object to another object
     * @param target_type the STIX type of the target
     * @param relationship_type optional, the type of the relationship, e.g "uses" or "mitigates"
     * @returns list of relationships
     */
    public getRelationshipsTo(target_type: string, relationship_type?: string): Relationship[] {
        return null; //TODO
    }

    /**
     * Get relationships from this object to another object
     * @param source_type the STIX type of the target
     * @param relationship_type optional, the type of the relationship, e.g "uses" or "mitigates"
     * @returns list of relationships
     */
    public getRelationshipsFrom(source_type: string, relationship_type?: string): Relationship[] {
        return null; //TODO
    }
}