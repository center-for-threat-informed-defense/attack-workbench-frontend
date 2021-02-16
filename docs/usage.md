<!-- This document shows up in-app as the root help page document -->
# ATT&CK Workbench Usage Documentation

ATT&CK Workbench is a tool designed to containerize the MITRE ATT&CK&reg; knowledge base, making ATT&CK easier to use and extend throughout the community. Our goal is to enable users of ATT&CK to easily instantiate their own copy of the ATT&CK knowledge base and provide the tools, infrastructure, and documentation to allow those organizations to both extend ATT&CK for their own needs and easily contribute to the ATT&CK knowledge base when appropriate.

## Collections

Accessing and sharing ATT&CK knowledge is realized through _collections_. A collection is a set of related ATT&CK objects; collections may be used represent specific releases of a dataset such as "Enterprise ATT&CK v7.2", or any other set of objects one may want to share with someone else. 

Collections can be created by anyone, not just ATT&CK. The ATT&CK Workbench application includes workflows for both importing and creating new collections. Collections can be shared as STIX bundles, uploaded to the internet, sent through email, or hosted on a [TAXII server](https://oasis-open.github.io/cti-documentation/taxii/intro.html). 

Data providers may opt to describe their published collections through a _collection index_ which provides a listing of collections. The ATT&CK Workbench Editor can be configured to subscribe to such indexes to automatically receive updates when they are available, or to allow the user to easily browse the collections listed by an index.

Objects may exist in multiple collections simultaneously, and objects can exist within the editor outside of the context of a collection. Collections exist at the _version_ level of an object: a specific version of the object is tagged with the collection instead of the object as a whole. If a user imports a collection, and then edits an object from that collection (thereby creating a new version of the object), the new version will not exist within that collection.

You can read more about the technical specifications for a collection, such as the STIX representation of a collection object, in our [collections](/docs/collections.md) document.

### Importing a collection
There are multiple means through which a collection can be imported. The "import collection" workflow provides the means through which a collection can be specified, its contents reviewed, and then incorporated to the local knowledge base instance.

#### 1. Indicate the collection
Users can import the collection in several different ways:
- *Import from URL*: In cases where the collection has been hosted on the internet, the user may specify the URL which the application can download the collection from.
- *Upload from file*: Users can also upload a STIX bundle representing the collection.
- *Import from collection index*: The user can choose to import collections listed by attached _collection indexes_, which are essentially lists of collections on the internet.

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

### Browsing Object History

Object history can be found in the resources drawer. The history timeline browser allows users to see changes to the object itself as well as changes to any relationships with the object. Clicking an event within the timeline will show what the corresponding object looked like at that moment in time.

- Events within the timeline are color-coded by type:
    - Purple events correspond to object changes
    - Blue events correspond to relationship changes
- Change types are differentiated by icon:
    - ![Plus](https://raw.githubusercontent.com/google/material-design-icons/master/png/content/add/materialicons/24dp/1x/baseline_add_black_24dp.png) denotes additions, such as the creation of the object itself or the addition of relationships with the object.
    - ![Pencil](https://raw.githubusercontent.com/google/material-design-icons/master/png/content/create/materialicons/24dp/1x/baseline_create_black_24dp.png) denotes modifications. Modifications to the object that change the version number are marked.
    - ![Download](https://raw.githubusercontent.com/google/material-design-icons/master/png/file/cloud_download/materialicons/24dp/1x/baseline_cloud_download_black_24dp.png) denotes the first available version of the object, but that earlier versions exist outside of what the user has in their workbench. 

## Adding notes to objects

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