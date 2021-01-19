import { Serializable } from './serializable';
import { VersionNumber } from './version-number';
// https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/blob/develop/docs/collections.md#collection-version-properties
export class CollectionVersion extends Serializable  {
    public version: VersionNumber;
    public modified: Date;
    public url: string;
    public taxii_url: string;
    public release_notes: string;
    constructor(raw?: any) {
        super();
        if (raw) this.deserialize(raw);
    }

     /**
     * Parse the object from the record returned from the back-end
     * @param {*} raw the raw object
     */
    public deserialize(raw: any) {
        this.version = new VersionNumber(raw.version);
        this.modified = new Date(raw.modified);
        if (raw.url) this.url = raw.url;
        else if (raw.taxii_url) this.taxii_url = raw.taxii_url;
        else throw new Error("error deserializing CollectionVersion: either 'url' or 'taxii_url' must be specified\n" + JSON.stringify(raw))
        if (raw.release_notes) this.release_notes = raw.release_notes;
    }
    /**
     * Transform the current object into a raw object for sending to the back-end, stripping any unnecessary fields
     * @returns {*} the raw object
     */
    public serialize(): any {
        return {
            "version": this.version.toString(),
            "modified": this.modified,
            "url": this.url,
            "taxii_url": this.taxii_url,
            "release_notes": this.release_notes
        }
    }
}
// https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/blob/develop/docs/collections.md#collection-reference-properties
export class CollectionReference extends Serializable  {
    public id: string;
    public name: string;
    public description: string;
    public created: Date;
    public versions: CollectionVersion[];
    public subscribed: boolean; //TODO how does this get determined
    public get lastModified(): Date { return this.versions[0].modified; }
    constructor(raw?: any) {
        super();
        if (raw) this.deserialize(raw);
    }
    /**
     * Parse the object from the record returned from the back-end
     * @param {*} raw the raw object
     */
    public deserialize(raw: any) {
        this.id = raw.id;
        this.name = raw.name;
        this.description = raw.description;
        this.created = new Date(raw.created);
        this.versions = raw.versions.map(version => new CollectionVersion(version));
        this.versions.sort((a:CollectionVersion,b:CollectionVersion) => b.version.compareTo(a.version)); //sort by modified date
    }
    /**
     * Transform the current object into a raw object for sending to the back-end, stripping any unnecessary fields
     * @returns {*} the raw object
     */
    public serialize(): any {
        return {
            "id": this.id,
            "name": this.name,
            "description": this.description,
            "created": this.created,
            "versions": this.versions.map(version => version.serialize())
        }
    }
}
// https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/blob/develop/docs/collections.md#collection-index-properties
export class CollectionIndex extends Serializable {
    public collection_index: {
        id: string,
        name: string,
        description: string,
        created: Date,
        modified: Date,
        collections: CollectionReference[]
    };
    public workspace: {
        remote_url: string, //url of the index
        update_policy?: {
            automatic: boolean, //if true, automatically fetch updates
            interval: number, //seconds between refreshes
            last_retrieval: Date,
            subscriptions: string[] // stix IDs of collection-references
        }
    };
    constructor(raw?: any) {
        super();
        if (raw) this.deserialize(raw);
    }
    /**
     * Parse the object from the record returned from the back-end
     * @param {*} raw the raw object
     */
    public deserialize(raw: any) {
        if (raw.collection_index) {
            this.collection_index = raw.collection_index;

            if (this.collection_index.collections) {
                this.collection_index.collections = this.collection_index.collections.map(rawRef => {
                    let ref = new CollectionReference();
                    ref.deserialize(rawRef);
                    ref.subscribed = raw.workspace.update_policy.subscriptions.includes(ref.id);
                    return ref;
                });
            } else { console.error("Error: collections field does not exist in collection index."); }
        }
        if (raw.workspace) this.workspace = raw.workspace;
    }
    /**
     * Transform the current object into a raw object for sending to the back-end, stripping any unnecessary fields
     * @returns {*} the raw object
     */
    public serialize(): any {
        let representation = {
            "collection_index": this.collection_index,
            "workspace": this.workspace
        }
        representation.collection_index.collections = representation.collection_index.collections.map(ref =>  ref.serialize())
        return representation;
    }

    /**
     * Check the current object is a valid collection index
     */
    public valid(): boolean {
        return ( this.collection_index.id && this.collection_index.name && this.collection_index.name.length > 0 &&
                 this.collection_index.created && this.collection_index.modified && this.collection_index.collections !== undefined );
    }
}