# Collections and Collection Indexes

This document describes the format and usage of [collections](#collections) and [collection indexes](#collection-indexes) which are used for distribution of ATT&CK data from **data providers** to **data consumers**.

- **Data Provider**

  MITRE ATT&CK and other users or organizations publishing or otherwise sharing ATT&CK data. This includes both open-source data and data distributed to a controlled list of data consumers. Generally encompasses users of the ATT&CK Workbench who publish collections containing data from their local knowledge base.

- **Data Consumer**

  A user or organization consuming the data from a data provider. Generally encompasses users of the ATT&CK Workbench who are pulling data into their knowledge base.

ATT&CK collections and the ATT&CK collection index can be found on our [attack-stix-data GitHub repository](https://github.com/mitre-attack/attack-stix-data).

## Collections
A _collection_ is a set of related ATT&CK objects; collections may be used to represent specific releases of a dataset such as "Enterprise ATT&CK v7.2", or any other set of objects one may want to share with someone else. 

Collections are meant to be shared. Collections can be shared as STIX bundles, uploaded to the internet, or sent through email. <!-- or hosted on a [TAXII server](https://oasis-open.github.io/cti-documentation/taxii/intro.html). -->

Data providers may opt to describe their published collections through a [collection index](#collection-indexes), a data structure designed to provide a machine-readable listing of collections. Collection indexes provide the means through which data consumers can _subscribe_ to updates from a data provider.

Typically collections are not modified after they are published. Subsequent releases of a dataset such as "Enterprise ATT&CK" would be represented by a new _version_ of the collection stored in a separate STIX bundle or TAXII collection; the continuity between releases is conveyed by the _collection index_ object detailed below. 

Collections by design reference a specific version of each object they contain. Conceptually, the object as a whole is not part of the collection; the collection instead contains the object as it was recorded at a specific moment in time. Oftentimes sequential versions of a collection will include updated versions of the contained objects in addition to new objects. This can be used to track the evolution of a dataset over time.

### Collection Properties
Collections are represented in STIX using the `x-mitre-collection` type, described below. This collection object should typically be provided alongside the contents of the collection within a STIX bundle. Only one `x-mitre-collection` object should be included in a given STIX bundle. <!-- or TAXII collection.-->

| Property Name | Data Type | Details |
|:--------------|:----------|:--------|
| **type** (required) | `string` | The type property identifies the type of object. The value of this property MUST be `x-mitre-collection` |
| **id** (required) | `identifier` | Uniquely identifies the object. Must follow the pattern `x-mitre-collection--{uuid4}`. |
| **name** (required) | `string` | A name used for display purposes. |
| **description** (optional) | `string` | More details, context, and explanation about the purpose or contents of the collection. |
| **created** (required) | `timestamp` | Represents the time at which the collection was originally created. |
| **modified**  (required)| `timestamp` | Represents the time at which the collection was most recently modified. |
| **x_mitre_version** (required) | `string` | The version of the collection object, which must follow the MAJOR.MINOR.PATCH pattern. |
| **spec_version** (required) | `string` | The version of the STIX specification used to represent the object. This value MUST be `2.1`.
| **created_by_ref** (required) | `string` | identifier | Specifies the **id** property of the `identity` object that describes the entity that created this collection. |
| **object_marking_refs** (required) | `list` of type `identifier` | Specifies a list of **id** properties of `marking-definition` objects that apply to this object. Typically used for copyright statements. |
| **x_mitre_contents** (required) | `list` of type _object version reference_ | Specifies the objects contained within the collection. See the _object version reference_ type below.  |

### Object Version Reference Properties
Object version references are used to refer to a specific version of a STIX object. They do this by combining a STIX ID of the object with the modified timestamp of the given version.

| Property Name | Data Type | Details |
|:--------------|:----------|:--------|
| **object_ref** (required) | `identifier` | The **id** of the referenced object. |
| **object_modified** (required) | `timestamp` | The modified time of the referenced object. It _MUST_ be an exact match for the `modified` time of the STIX object being referenced. |


### Collection Example
```json
{
    "id": "x-mitre-collection--23320f4-22ad-8467-3b73-ed0c869a12838",
    "type": "x-mitre-collection",
    "spec_version": "2.1",
    "name": "Enterprise ATT&CK",
    "x_mitre_version": "6.2",
    "description": "Version 6.2 of the Enterprise ATT&CK dataset",
    "created_by_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5",
    "created": "2018-10-17T00:14:20.652Z",
    "modified": "2019-10-11T19:30:42.406Z",
    "object_marking_refs": [
        "marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168"
    ],
    "x_mitre_contents": [
        {
            "object_ref": "attack-pattern--01a5a209-b94c-450b-b7f9-946497d91055",
            "object_modified": "2019-07-17T20:04:40.297Z"
        },
        {
            "object_ref": "attack-pattern--0259baeb-9f63-4c69-bf10-eb038c390688",
            "object_modified": "2019-06-18T13:58:28.377Z"
        },
        {
            "object_ref": "relationship--0024d82d-97ea-4dc5-81a1-8738862e1f3b",
            "object_modified": "2019-04-24T23:59:16.298Z"
        },
        {
            "object_ref": "intrusion-set--090242d7-73fc-4738-af68-20162f7a5aae",
            "object_modified": "2019-03-22T14:21:19.419Z"
        },
        {
            "object_ref": "malware--069af411-9b24-4e85-b26c-623d035bbe84",
            "object_modified": "2019-04-22T22:40:40.953Z"
        },
        {
            "object_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5",
            "object_modified": "2017-06-01T00:00:00.000Z"
        },
        {
            "object_ref": "marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168",
            "object_modified": "2017-06-01T00:00:00.000Z"
        }
    ]
}
```

_Note: the collection object above would typically be stored in a STIX bundle alongside the objects it references._

## Collection Indexes

Collections may be referenced by _collection indexes_, which are essentially an organized list of collections. Typically, collection indexes only refer to collections created by the organization maintaining the index. The ATT&CK Workbench can subscribe to collections within the index to automatically receive updates when the index itself is updated.


### Collection Index Properties
Collection Indexes are plain JSON, _not_ STIX, and therefore _should not_ be included within STIX bundles or on a TAXII server. They instead refer to the STIX bundles or TAXII collections wherein the collections are held.

| Property Name | Data Type | Details |
|:--------------|:----------|:--------|
| **id** (required) | `string` | Unique identifier for the collection index. |
| **name** (required) | `string` | A name used for display purposes. |
| **description** (optional) | `string` | More details, context, and explanation about the purpose or contents of the collection index. |
| **created** (required) | `timestamp` | Represents the time at which the collection index was originally created. |
| **modified**  (required)| `timestamp` | Represents the time at which the collection index was most recently modified. |
| **collections** (required) | `list` of type _collection reference_ | See the _collection reference_ data type below. |

### Collection Reference Properties
Collection References describe to specific collections within a _collection index_.

| Property Name | Data Type | Details |
|:--------------|:----------|:--------|
| **id** (required) | `identifier` | Must match the **id** field of the collection being referenced. All versions of the referenced collection must have the same **id**. |
| **name** (required) | `string` | The name of the collection. |
| **description** (required) | `string` | The description of the collection. |
| **created** (required) | `timestamp` | Represents the time when the collection was created. This property must match the **created** property of the collection to which it refers. All collection versions must have the same `created` time. |
| **versions** (required) | `list` of type _collection Version_ | Specifies the distinct versions of the given collection. See the _collection version_ data type below. |

### Collection Version Properties
Collection version objects describe specific versions of collections within a _collection reference_.

| Property Name | Data Type | Details |
|:--------------|:----------|:--------|
| **version** (required) | `string` | Must match the **version** field of the collection being referenced. |
| **modified** (required) | `timestamp` | Represents the time when the collection version was last modified. This property must match the **modified** property of the collection to which it refers. |
| **url** (optional*) | `string` | Specifies the URL of the collection STIX bundle holding the collection. *Either this property or **taxii_url** _MUST_ be specified. |
| **taxii_url** (optional*) | `string` | Specifies the TAXII URL of the TAXII collection holding the collection. *Either this property or **url** _MUST_ be specified. The ATT&CK Workbench doesn't currently support loading collections over TAXII. |
| **release_notes** (optional) | `string` | Release notes for this version of the collection. |

### Collection Index Example
```json
{
    "id": "bb8c95c0-4e8f-491e-a3c9-8b4207e43041",
    "name": "MITRE ATT&CK",
    "description": "All ATT&CK datasets",
    "created": "2017-06-01T00:00:00.000Z",
    "modified": "2019-07-17T20:04:40.297Z",
    "collections": [
        {
            "id": "x-mitre-collection--23320f4-22ad-8467-3b73-ed0c869a12838",
            "name": "Enterprise ATT&CK",
            "description": "The Enterprise domain of the ATT&CK dataset",
            "created": "2019-07-31T00:00:00.000Z",
            "versions": [
                {
                    "version": "5.0.0",
                    "url": "https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v5.0/enterprise-attack/enterprise-attack.json",
                    "modified": "2019-07-31T00:00:00.000Z"
                },
                {
                    "version": "6.0.0",
                    "url": "https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v6.0/enterprise-attack/enterprise-attack.json",
                    "modified": "2019-10-24T00:00:00.000Z"
                },
                {
                    "version": "6.1.0",
                    "url": "https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v6.1/enterprise-attack/enterprise-attack.json",
                    "modified": "2019-11-21T00:00:00.000Z"
                },
                {
                    "version": "6.2.0",
                    "url": "https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v6.2/enterprise-attack/enterprise-attack.json",
                    "modified": "2019-12-02T00:00:00.000Z",
                    "release_notes": "information about what changed in v6.2.0 goes here"
                }
            ]
        },
        {
            "id": "x-mitre-collection--dac0d2d7-8653-445c-9bff-82f934c1e858",
            "name": "Mobile ATT&CK",
            "description": "The Mobile domain of the ATT&CK dataset",
            "created": "2019-07-31T00:00:00.000Z",
            "versions": [
                {
                    "version": "5.0.0",
                    "url": "https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v5.0/mobile-attack/mobile-attack.json",
                    "modified": "2019-07-31T00:00:00.000Z"
                },
                {
                    "version": "6.0.0",
                    "url": "https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v6.0/mobile-attack/mobile-attack.json",
                    "modified": "2019-10-24T00:00:00.000Z"
                },
                {
                    "version": "6.1.0",
                    "url": "https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v6.1/mobile-attack/mobile-attack.json",
                    "modified": "2019-11-21T00:00:00.000Z"
                },
                {
                    "version": "6.2.0",
                    "url": "https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v6.2/mobile-attack/mobile-attack.json",
                    "modified": "2019-12-02T00:00:00.000Z",
                    "release_notes": "information about what changed in v6.2.0 goes here"
                }
            ]
        },
        {
            "id": "x-mitre-collection--90c00720-636b-4485-b342-8751d232bf09",
            "name": "ATT&CK for ICS",
            "description": "The ICS domain of the ATT&CK dataset",
            "created": "2020-10-01T00:00:00.000Z",
            "versions": [
                {
                    "version": "8.0.0",
                    "taxii_url": "https://cti-taxii.mitre.org/stix/collections/0bb14cfb-58fa-4284-ba85-43ab76dd4622",
                    "modified": "2020-10-01T00:00:00.000Z"
                }
            ]
        }
    ]
}

