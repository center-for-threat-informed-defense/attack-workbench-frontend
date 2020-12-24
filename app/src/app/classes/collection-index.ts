import { VersionNumber } from './version-number';
// https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/blob/develop/docs/collections.md#collection-version-properties
export class CollectionVersion {
    public version: VersionNumber;
    public modified: Date;
    public url: string;
    public taxii_url: string;
    public release_notes: string;
    public downloaded: boolean = false; //is the collection version downloaded and present in the user's local knowledge base?
    constructor(raw: any) {
        this.version = new VersionNumber(raw.version);
        this.modified = new Date(raw.modified);
        if (raw.url) this.url = raw.url;
        else if (raw.taxii_url) this.taxii_url = raw.taxii_url;
        else throw new Error("error deserializing CollectionVersion: either 'url' or 'taxii_url' must be specified\n" + JSON.stringify(raw), )
        if (raw.release_notes) this.release_notes = raw.release_notes;
        if (raw.downloaded) this.downloaded = raw.downloaded; // TODO this is for mock data stuff
    }
}
// https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/blob/develop/docs/collections.md#collection-reference-properties
export class CollectionReference {
    public id: string;
    public name: string;
    public description: string;
    public created: Date;
    public versions: CollectionVersion[];
    public subscribed: boolean; //TODO how does this get determined
    public get lastModified(): Date { return this.versions[0].modified; }
    constructor(raw: any) {
        this.id = raw.id;
        this.name = raw.name;
        this.description = raw.description;
        this.created = new Date(raw.created);
        this.versions = raw.versions.map(version => new CollectionVersion(version));
        this.versions.sort((a:CollectionVersion,b:CollectionVersion) => b.version.compareTo(a.version)); //sort by modified date
        this.subscribed = raw.subscribed ? raw.subscribed : false; // TODO this is for mock data stuff
    }
}
// https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/blob/develop/docs/collections.md#collection-index-properties
export class CollectionIndex {
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
    // constructor(raw: any) {
    //     this.id = raw.id;
    //     this.name = raw.name;
    //     this.description = raw.description;
    //     this.created = new Date(raw.created);
    //     this.modified = new Date(raw.modified);
    //     this.collections = raw.collections.map(collection => new CollectionReference(collection));
    // }
}

// export interface CollectionIndexRecord {
//     collection_index: CollectionIndex,
//     workspace: {
//         remote_url: string, //url of the index
//         update_policy?: {
//             automatic: boolean, //if true, automatically fetch updates
//             interval: number, //seconds between refreshes
//             last_retrieval: Date,
//             subscriptions: string[] // stix IDs of collection-references
//         }
//     }
// }

// mock collection index data
// let exampleCollectionIndexes = [new CollectionIndex({
//     "id": "bb8c95c0-4e8f-491e-a3c9-8b4207e43041",
//     "name": "MITRE ATT&CK",
//     "description": "All ATT&CK datasets",
//     "created": "2017-06-01T00:00:00.000Z",
//     "modified": "2020-10-01T00:00:00.000Z",
//     "collections": [
//         {
//             "id": "x-mitre-collection--23320f4-22ad-8467-3b73-ed0c869a12838",
//             "name": "Enterprise ATT&CK",
//             "description": "The Enterprise domain of the ATT&CK dataset",
//             "created": "2019-07-31T00:00:00.000Z",
//             "subscribed": true,
//             "versions": [
//                 {
//                     "version": "5.0.0",
//                     "url": "https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v5.0/enterprise-attack/enterprise-attack.json",
//                     "modified": "2019-07-31T00:00:00.000Z"
//                 },
//                 {
//                     "version": "6.0.0",
//                     "url": "https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v6.0/enterprise-attack/enterprise-attack.json",
//                     "modified": "2019-10-24T00:00:00.000Z"
//                 },
//                 {
//                     "version": "6.1.0",
//                     "url": "https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v6.1/enterprise-attack/enterprise-attack.json",
//                     "modified": "2019-11-21T00:00:00.000Z",
//                     "downloaded": true
//                 },
//                 {
//                     "version": "6.2.0",
//                     "url": "https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v6.2/enterprise-attack/enterprise-attack.json",
//                     "modified": "2019-12-02T00:00:00.000Z",
//                     "release_notes": "information about what changed in v6.2.0 goes here",
//                     "downloaded": true
//                 }
//             ]
//         },
//         {
//             "id": "x-mitre-collection--dac0d2d7-8653-445c-9bff-82f934c1e858",
//             "name": "Mobile ATT&CK",
//             "description": "The Mobile domain of the ATT&CK dataset",
//             "created": "2019-07-31T00:00:00.000Z",
//             "versions": [
//                 {
//                     "version": "5.0.0",
//                     "url": "https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v5.0/mobile-attack/mobile-attack.json",
//                     "modified": "2019-07-31T00:00:00.000Z"
//                 },
//                 {
//                     "version": "6.0.0",
//                     "url": "https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v6.0/mobile-attack/mobile-attack.json",
//                     "modified": "2019-10-24T00:00:00.000Z",
//                     "downloaded": true
//                 },
//                 {
//                     "version": "6.1.0",
//                     "url": "https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v6.1/mobile-attack/mobile-attack.json",
//                     "modified": "2019-11-21T00:00:00.000Z"
//                 },
//                 {
//                     "version": "6.2.0",
//                     "url": "https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v6.2/mobile-attack/mobile-attack.json",
//                     "modified": "2019-12-02T00:00:00.000Z",
//                     "release_notes": "information about what changed in v6.2.0 goes here"
//                 }
//             ]
//         },
//         {
//             "id": "x-mitre-collection--90c00720-636b-4485-b342-8751d232bf09",
//             "name": "ATT&CK for ICS",
//             "description": "The ICS domain of the ATT&CK dataset",
//             "created": "2020-10-01T00:00:00.000Z",
//             "subscribed": true,
//             "versions": [
//                 {
//                     "version": "8.0.0",
//                     "taxii_url": "https://cti-taxii.mitre.org/stix/collections/0bb14cfb-58fa-4284-ba85-43ab76dd4622",
//                     "modified": "2020-10-01T00:00:00.000Z",
//                     "downloaded": true
//                 }
//             ]
//         }
//     ]
// }), new CollectionIndex({
//     "id": "ad0dc7ff-e97e-4862-8326-7dc2dfbb42e5",
//     "name": "Charming Collection Curation",
//     "description": "Sublimely charming collections curated by Herbert Exampleuser",
//     "created": "2016-05-01T00:00:00.000Z",
//     "modified": "2020-12-08T00:00:00.000Z",
//     "collections": [
//         {
//             "id": "x-mitre-collection--23320f4-22ad-8467-3b73-ed0c869a12838",
//             "name": "Funky Techniques",
//             "description": "A curated selection of the most funktacular techniques",
//             "created": "2018-05-15T00:00:00.000Z",
//             "versions": [
//                 {
//                     "version": "1.0.0",
//                     "url": "https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v5.0/enterprise-attack/enterprise-attack.json",
//                     "modified": "2019-07-31T00:00:00.000Z"
//                 },
//                 {
//                     "version": "1.1.0",
//                     "url": "https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v6.0/enterprise-attack/enterprise-attack.json",
//                     "modified": "2019-10-24T00:00:00.000Z"
//                 }
//             ]
//         },
//         {
//             "id": "x-mitre-collection--dac0d2d7-8653-445c-9bff-82f934c1e858",
//             "name": "Mitigations for your soul",
//             "description": "Sometimes souls are too intense. Here's how to mitigate having a soul.",
//             "created": "2020-12-08T00:00:00.000Z",
//             "versions": [
//                 {
//                     "version": "1.0.0",
//                     "url": "https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v6.2/mobile-attack/mobile-attack.json",
//                     "modified": "2020-12-08T00:00:00.000Z",
//                     "release_notes": "# Woah look at the formatting\n\nI have words to say about things \n\n- a\n- b\n- c"
//                 }
//             ]
//         },
//     ]
// }), new CollectionIndex({
//     "id": "ad0dc7ff-e97e-4862-8326-7dc2dfbb42e5",
//     "name": "Wanda's Datasets",
//     "description": "example description",
//     "created": "2016-05-01T00:00:00.000Z",
//     "modified": "2020-12-01T00:00:00.000Z",
//     "collections": [
//         {
//             "id": "x-mitre-collection--23320f4-22ad-8467-3b73-ed0c869a12838",
//             "name": "Wanda's Groups",
//             "description": "Groups created by Wanda",
//             "created": "2018-05-15T00:00:00.000Z",
//             "versions": [
//                 {
//                     "version": "1.0.0",
//                     "url": "https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v5.0/enterprise-attack/enterprise-attack.json",
//                     "modified": "2019-07-31T00:00:00.000Z"
//                 },
//             ]
//         },
//         {
//             "id": "x-mitre-collection--dac0d2d7-8653-445c-9bff-82f934c1e858",
//             "name": "Wanda's Software",
//             "description": "Software created by Wanda",
//             "created": "2020-12-01T00:00:00.000Z",
//             "versions": [
//                 {
//                     "version": "1.0.0",
//                     "url": "https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v6.2/mobile-attack/mobile-attack.json",
//                     "modified": "2020-12-01T00:00:00.000Z",
//                 }
//             ]
//         },
//     ]
// })];

// export {exampleCollectionIndexes};