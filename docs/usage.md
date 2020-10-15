<!-- This document shows up in-app as the root help page document -->
# Federated ATT&CK Usage Documentation

Federated ATT&CK is a tool designed to containerize the MITRE ATT&CK&reg; knowledge base, making ATT&CK easier to use and extend throughout the community. Our goal is to enable users of ATT&CK to easily instantiate their own copy of the ATT&CK knowledge base and provide the tools, infrastructure, and documentation to allow those organizations to both extend ATT&CK for their own needs and easily contribute to the ATT&CK knowledge base when appropriate.

## Collections

Accessing and sharing ATT&CK knowledge is realized through _collections_. A collection is a set of related ATT&CK objects; collections may be used represent specific releases of a dataset such as "enterprise ATT&CK v7.2", or any other set of objects one may want to share with someone else. 

Collections can be created by anyone, not just ATT&CK. The Federated ATT&CK Editor application includes workflows for both importing and creating new collections. Collections can be shared as STIX bundles, uploaded to the internet, sent through email, or hosted on a [TAXII server](https://oasis-open.github.io/cti-documentation/taxii/intro.html). 

Objects may exist in multiple collections simultaneously, and objects can exist within the editor outside of the context of a collection. Collections exist at the _version_ level of an object: a specific version of the object is tagged with the collection instead of the object as a whole. If a user imports a collection, and then edits an object from that collection (thereby creating a new version of the object), the new version will not exist within that collection.

You can read more about the technical specifications for a collection, such as the STIX representation of a collection object, in our [collections](/docs/collections.md) document.

### Importing a collection
There are multiple means through which a collection can be imported. The "import collection" workflow provides the means through which a collection can be specified, its contents reviewed, and then incorporated to the local knowledge base instance.

#### 1. Indicate the collection
Users can import the collection in two different ways:
- *Import from URL*: In cases where the collection has been hosted on the internet, the user may specify the URL which the application can download the collection from.
- *Upload from file*: Users can also upload a STIX bundle representing the collection.

#### 2. Review contents
In this step, the user should review the contents of the collection being imported. The review step is provided to ensure that users have control over the contents of their local knowledge base. Users can choose to only import specific objects from the collection if they so choose, or likewise exclude certain objects from the import. 

#### 3. Incorporate into knowledge base
After selecting the objects to import, the application will automatically integrate them into the knowledge base. 

In cases where objects being imported already exist in the knowledge base, the imported object will appear as a new _version_ of that object. 
- If it was edited more recently than the copy already in the knowledge base, it will appear as the most recent version (supersede the version already in the knowledge base). 
- If it was edited less recently than the copy already in the knowledge base, it will appear as a _previous version_ of the object (superseded by the version already in the knowledge base).

In both cases, the user may need to manually merge the two versions to prevent the incoming knowledge, or knowledge created by the user, from being lost. Such version conflicts will be indicated in the import summary page.

### Exporting a collection
Collections can be created, or new versions of existing collections drafted, through the "export collection" workflow. 

## Viewing objects

## Editing objects

### Editing Matrices
### Editing Techniques
### Editing Tactics
### Editing Mitigations
### Editing Software
### Editing Domains

### Managing Citations



## Further reading
- [Philosophy Paper](https://attack.mitre.org/docs/ATTACK_Design_and_Philosophy_March_2020.pdf): This whitepaper provides an in-depth look at why ATT&CK was created, how it is updated and maintained, and common community uses.
- [MITRE/CTI USAGE](https://github.com/mitre/cti/blob/master/USAGE.md): This document details the STIX representation of the ATT&CK knowledge base and provides examples of how to work with ATT&CK data programmatically.