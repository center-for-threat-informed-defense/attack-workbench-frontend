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
        let version = raw;

        if ("version" in version) {
            if (typeof(version.version) === "string") this.version = new VersionNumber(version.version);
            else console.error("TypeError: version field is not a string:", version.version, "(", typeof(version.version), ")");
        } else this.version = new VersionNumber("0.1");

        if ("modified" in version) {
            if (typeof(version.modified) === "string") this.modified = new Date(version.modified);
            else console.error("TypeError: modified field is not a string:", version.modified, "(", typeof(version.modified), ")");
        } else this.modified = new Date();

        if ("url" in version) {
            if (typeof(version.url) === "string") this.url = version.url;
            else console.error("TypeError: url field is not a string:", version.url, "(", typeof(version.url), ")");
        }
        else if ("taxii_url" in version) {
            if (typeof(version.taxii_url) === "string") this.taxii_url = version.taxii_url;
            else console.error("TypeError: taxii_url field is not a string:", version.taxii_url, "(", typeof(version.taxii_url), ")"); 
        }
        else throw new Error("error deserializing CollectionVersion: either 'url' or 'taxii_url' must be specified\n" + JSON.stringify(version))

        if ("release_notes" in version) {
            if (typeof(version.release_notes) === "string") this.release_notes = version.release_notes;
            else console.error("TypeError: release_notes field is not a string:", version.release_notes, "(", typeof(version.release_notes), ")");
        }
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
        let ref = raw;

        if ("id" in ref) {
            if (typeof(ref.id) === "string") this.id = ref.id;
            else console.error("TypeError: id field is not a string:", ref.id, "(", typeof(ref.id), ")");
        }
        if ("name" in ref) {
            if (typeof(ref.name) === "string") this.name = ref.name;
            else console.error("TypeError: name field is not a string:", ref.name, "(", typeof(ref.name), ")");
        }
        if ("description" in ref) {
            if (typeof(ref.description) === "string") this.description = ref.description;
            else console.error("TypeError: description field is not a string:", ref.description, "(", typeof(ref.description), ")");
        }
        if ("created" in ref) {
            if (typeof(ref.created) === "string") this.created = new Date(ref.created);
            else console.error("TypeError: created field is not a string:", ref.created, "(", typeof(ref.created), ")");
        } else this.created = new Date();

        if ("versions" in ref) {
            if (typeof(ref.versions) === "object") {
                this.versions = ref.versions.map(version => new CollectionVersion(version));
                this.versions.sort((a:CollectionVersion,b:CollectionVersion) => b.version.compareTo(a.version)); //sort by modified date
            } else console.error("TypeError: versions field is not an object:", ref.versions, "(", typeof(ref.versions), ")");
        }
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
            let collection_index: any = {};

            if ("id" in raw.collection_index) {
                if (typeof(raw.collection_index.id) === "string") collection_index.id = raw.collection_index.id;
                else console.error("TypeError: id field is not a string:", raw.collection_index.id, "(", typeof(raw.collection_index.id), ")");
            }
            if ("name" in raw.collection_index) {
                if (typeof(raw.collection_index.name) === "string") collection_index.name = raw.collection_index.name;
                else console.error("TypeError: name field is not a string:", raw.collection_index.name, "(", typeof(raw.collection_index.name), ")");
            }
            if ("description" in raw.collection_index) {
                if (typeof(raw.collection_index.description) === "string") collection_index.description = raw.collection_index.description;
                else console.error("TypeError: description field is not a string:", raw.collection_index.description, "(", typeof(raw.collection_index.description), ")");
            }
            if ("created" in raw.collection_index) {
                if (typeof(raw.collection_index.created) === "string") collection_index.created = new Date(raw.collection_index.created);
                else console.error("TypeError: created field is not a string:", raw.collection_index.created, "(", typeof(raw.collection_index.created), ")");
            } else collection_index.created = new Date();

            if ("modified" in raw.collection_index) {
                if (typeof(raw.collection_index.modified) === "string") collection_index.modified = new Date(raw.collection_index.modified);
                else console.error("TypeError: modified field is not a string:", raw.collection_index.modified, "(", typeof(raw.collection_index.modified), ")");
            } else collection_index.modified = new Date();

            if ("collections" in raw.collection_index) {
                if (typeof(raw.collection_index.collections) === "object") {
                    collection_index.collections = raw.collection_index.collections.map(rawRef => {
                        let ref = new CollectionReference();
                        ref.deserialize(rawRef);
                        ref.subscribed = raw.workspace.update_policy.subscriptions.includes(ref.id);
                        return ref;
                    });
                } else console.error("TypeError: collections field is not an object:", raw.collection_index.collections, "(", typeof(raw.collection_index.collections), ")");
            }

            this.collection_index = collection_index;
        }

        if (raw.workspace) {
            let workspace: any = {};

            if ("remote_url" in raw.workspace) {
                if (typeof(raw.workspace.remote_url) === "string") workspace.remote_url = raw.workspace.remote_url;
                else console.error("TypeError: remote_url field is not a string:", raw.workspace.remote_url, "(", typeof(raw.workspace.remote_url), ")");
            }
            if ("update_policy" in raw.workspace) {
                let update_policy = raw.workspace.update_policy;
                let tmp_policy: any = {};

                if ("automatic" in update_policy) {
                    if (typeof(update_policy.automatic) === "boolean") tmp_policy.automatic = update_policy.automatic;
                    else console.error("TypeError: automatic field is not a boolean:", update_policy.automatic, "(", typeof(update_policy.automatic), ")");
                }
                if ("interval" in update_policy) {
                    if (typeof(update_policy.interval) === "number") tmp_policy.interval = update_policy.interval;
                    else console.error("TypeError: interval field is not a number:", update_policy.interval, "(", typeof(update_policy.interval), ")");
                }
                if ("last_retrieval" in update_policy) {
                    if (typeof(update_policy.last_retrieval) === "string") tmp_policy.last_retrieval = new Date(update_policy.last_retrieval);
                    else console.error("TypeError: last_retrieval field is not a string:", update_policy.last_retrieval, "(", typeof(update_policy.last_retrieval), ")");
                }
                if ("subscriptions" in update_policy) {
                    if (typeof(update_policy.subscriptions) === "object") tmp_policy.subscriptions = update_policy.subscriptions;
                    else console.error("TypeError: subscriptions field is not an object:", update_policy.subscriptions, "(", typeof(update_policy.subscriptions), ")");
                }
                workspace.update_policy = tmp_policy;
            }

            this.workspace = workspace;
        }
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