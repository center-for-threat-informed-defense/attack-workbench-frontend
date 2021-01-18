import { Relationship } from './relationship';
import { VersionNumber } from '../version-number';
import { ExternalReferences } from '../external-references';
import { v4 as uuid } from 'uuid';
import { Serializable } from '../serializable';

export abstract class StixObject extends Serializable {
    public stixID: string; // STIX ID
    public type: string;   // STIX type
    public attackType: string; // ATT&CK type
    

    public get routes(): any[] { // route to view the object
        // let baseRoute = "/" + [this.attackType, this.stixID].join("/")
        return [
            {
                "label": "view",
                "route": ""
            }, {
                "label": "edit",
                "route": "",
                "query": {"editing": true}
            }
        ]
    } 

    public created: Date;  // object created date
    public modified: Date; // object modified date
    public version: VersionNumber;  // version number of the object
    public external_references: ExternalReferences;

    public deprecated: boolean = false; //is object deprecated?
    public revoked: boolean = false;    //is object revoked?

    /**
     * Initialize the STIX object
     * @param sdo the STIX domain object to initialize data from
     */
    constructor(sdo?: any, type?: string) {
        super();
        if (sdo) {
            this.base_deserialize(sdo);
        } else {
            // create new SDO
            this.stixID = type + "--" + uuid();
            this.type = type;
            this.created = new Date();
            this.modified = new Date();
            this.version = new VersionNumber("0.1");
            this.external_references = new ExternalReferences()
        }
        this.attackType = {
            "x-mitre-collection": "collection",
            "attack-pattern": "technique",
            "malware": "software",
            "tool": "software",
            "intrusion-set": "group",
            "course-of-action": "mitigation",
            "x-mitre-matrix": "matrix",
            "x-mitre-tactic": "tactic",
            "relationship": "relationship"
        }[this.type]
    }

    /**
     * Transform the current object into a raw object for sending to the back-end, stripping any unnecessary fields
     * @abstract
     * @returns {*} the raw object to send
     */
    public base_serialize(): any {
        return {
            "type": this.type,
            "id": this.stixID,
            "created": this.created,
            "modified": this.modified,
            "version": this.version.toString(),
            "external_references": this.external_references.serialize(),
            "x_mitre_deprecated": this.deprecated,
            "revoked": this.revoked
        }
    }

    /**
     * Parse the object from the record returned from the back-end
     * @abstract
     * @param {*} raw the raw object to parse
     */
    public base_deserialize(raw: any) {
        let sdo = raw;
        // initialize common fields from SDO
        this.stixID = sdo.id;
        this.type = sdo.type;
        
        this.created = new Date(sdo.created);
        this.modified = new Date(sdo.modified);
        this.version = sdo.x_mitre_version? new VersionNumber(sdo.x_mitre_version) : new VersionNumber("0.1");
        this.external_references = new ExternalReferences(sdo.external_references);

        if ("x_mitre_deprecated" in sdo) this.deprecated = sdo.x_mitre_deprecated;
        if ("revoked" in sdo) this.revoked = sdo.x_mitre_revoked;
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