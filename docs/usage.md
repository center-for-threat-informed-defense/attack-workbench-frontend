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
<!-- - *Upload from file*: Users can also upload a STIX bundle representing the collection. -->
- *Import from collection index*: The user can choose to import collections listed by attached _collection indexes_, which are essentially lists of collections on the internet.

#### 2. Review contents
In this step, the user should review the contents of the collection being imported. The review step is provided to ensure that users have control over the contents of their local knowledge base. Users can choose to only import specific objects from the collection if they so choose, or likewise exclude certain objects from the import. 

While previewing an import the list of contents will be organized by object type, and then by change type. The change types are as follows:
- *Additions*: Additions; objects which were not previously in the knowledge base.
- *Changes*: Updated objects; Objects with major updates such as changes to scope, new reporting, and so forth.
- *Minor changes*: Objects with minor updates such as typo corrections.
- *Revocations*: Objects that have been replaced by other objects.
- *Deprecations*: Objects that have been removed from the dataset.
- *Duplicates*: Objects that already exist in the workbench and have no changes.  
- *Out of date*: Objects which are outdated by more recent edits in your knowledge base. These objects already exist in your workbench, and the version in the collection is older. The version imported in the collection will appear in the version history of the object.

The following error change types may appear when there are conflicts importing a collection:
- *Import conflicts*: Object supersedes local edits, and the user should merge their changes with the new object content.
- *Other Errors*: The workbench encountered errors when determining whether the following objects exist within the workbench already.

##### Reviewing a previous import

After importing a collection, users can review the results of the import from the collection page. The collection review UI reflects the changes that occurred at the time of the import.

#### 3. Incorporate into knowledge base
After selecting the objects to import, the application will automatically integrate them into the knowledge base. 

In cases where objects being imported already exist in the knowledge base, the imported object will appear as a new _version_ of that object. 
- If it was edited more recently than the copy already in the knowledge base, it will appear as the most recent version (supersede the version already in the knowledge base). 
- If it was edited less recently than the copy already in the knowledge base, it will appear as a _previous version_ of the object (superseded by the version already in the knowledge base).

In both cases, the user may need to manually merge the two versions to prevent the incoming knowledge, or knowledge created by the user, from being lost. 



### Exporting a collection
Collections can be created, or new versions of existing collections drafted, through the "export collection" workflow. 

## Viewing objects

### Browsing Object History

Object history can be found in the resources drawer. The history timeline browser allows users to see changes to the object itself as well as changes to any relationships with the object. Clicking an event within the timeline will show what the corresponding object looked like at that moment in time.

- Events within the timeline are color-coded by type:
    - Purple events correspond to object changes
    - Blue events correspond to relationship changes
- Events within the timeline are also differentiated by type, denoted by tooltip and icon:
    - A plus symbol denotes additions, such as the creation of the object itself or the addition of relationships with the object.
    - A pencil symbol denotes modifications. Modifications to the object that change the version number have additional markings.
    - A download icon denotes the first available version of the object, but that earlier versions exist outside of what the user has in their workbench. This occurs when an object has been imported from a collection.

### Adding notes to objects

## Editing objects

#### Descriptions

Description and (on techniques) detection fields contain the primary content of the object. As such, they support markdown formatting. The ATT&CK Workbench uses the [GitHub-Flavored Markdown (GFM)](https://github.github.com/gfm/) syntax, though applications consuming ATT&CK data may not support this extension to the commonMark spec. A preview tab is also provided to check if the markdown you've written compiles as expected.

##### Using Citations

Description and detection fields allow for in-text citations. Citations are formatted in plain text as `(Citation: source name)`, which corresponds to the source name of a reference. This will get compiled to a citation marker with hyperlink when rendered, and the relevant reference added to the references section of the object when it is saved.

The reference manager can be used to add, edit, and find references. The reference manager can be found in the application sidebar from any page, and contains a list of all references on all objects, as well as references you've created to add to objects later. 
- When a collection is imported, all references will be added to the master list in the sidebar.
- Once a reference has been created, you cannot change the source name.
- If you edit the description or URL on an existing reference, any objects which cite this reference will automatically be updated with the adjusted data. The interface will notify you of which objects contain the updated reference.
- You can use the "copy" button on a reference in the list to quickly copy the full citation string to your clipboard for later placement within a description.

Citations are also supported within group and software alias descriptions, although markdown formatting is not allowed within those fields.

#### ATT&CK IDs

ATT&CK IDs must follow a prescribed format:

| Object Type | ID Format |
|:------------|:----------|
| Matrix           | (domain identifier) |
| Tactic           | `TAxxxx` |
| Technique        | `Txxxx` |
| Sub-Technique   |  `Txxxx.yyy` |
| Mitigation       | `Mxxxx` |
| Group            | `Gxxxx`  |
| Software         | `Sxxxx` |

<!-- TODO improve ID namespacing guidance and support -->
<!-- All IDs _can_ be prefixed with an organization identifier. This allows name-spacing of IDs by the creating organization to prevent ID collisions between data providers creating objects. Organization prefixes:
- are joined to the ID using a double hyphen
- can not include any whitespace characters
- should be lowercase

Examples of IDs with an organization identifier include `acme--T1000`, `octan--G1056`, `xyz-co--M1200`.  -->
#### Version Numbers

All objects (Excepting relationships) support version numbers. Version numbers can have any level of granularity, but it is recommended to use 2 levels of granularity, formatted as `major.minor`:
   - *major* updates include revisions to object scope.
   - *minor* updates include additions to reporting and content that do not change the overall scope of the object.
   <!-- - *patch* updates include fixes in the object content such as typo corrections-->

When saving an object, the validation window will prompt you to increment the version number you haven't already edited the version field. We recommend data providers be careful when incrementing versions so as to avoid double-increments between releases.



### Validating changes

When saving an object, the application will validate the data to ensure it matches the spec. There are four types of messages that can be shown in the validation window:
- *Successes*, which let you know that things are as they should be. This will tell you that your object has a unique name and ID and other important messages.
- *Warnings*, which tell you that you might want to make a correction, but don’t prevent you from saving altogether. Name conflicts for instance are a warning: nothing will break if there’s a conflict, but it should still be avoided if possible.
- *Errors*, which tell you that you can’t save until you’ve fixed the mistake. ATT&CK ID conflicts, malformed version numbers and duplicate relationships are examples of validation errors.
- *Info*, which convey other information about your changes. Letting you know that you’ve already incremented the version number (and shouldn’t/can’t use the automatic version-increment buttons) is an example of an info message.

Once you have reviewed the validation feedback you can proceed to save the object unless errors are present, which must be corrected first.

### Editing Matrices

Matrices share the typical fields on objects, including a description supporting markdown and citations. Unlike other object types, their IDs serve as identifier for their domain:

| Domain | ID |
|:------------|:----------|
| Enterprise     | enterprise-attack |
| Mobile           | mobile-attack |
| ICS           | ics-attack |

Multiple matrices _can_ exist for a domain (e.x _Device Access_ and _Network-Based Effects_ in the Mobile domain), and matrices of the same domain share IDs.

#### Editing tactics on matrices
The order of tactics in matrices can be added, ordered, and removed. Tactic ordering can be completed by using the mouse to drag and drop the entire row or by clicking on the up/down arrows. Tactics recently added to the matrix will appear at the bottom of the tactic list.

#### Relationships with Matrices
Matrices do not have any associated relationships.

### Editing Techniques

Techniques represent "how" an adversary achieves a tactical goal by performing an action. For example, an adversary may dump credentials to achieve credential access.

Like all objects, techniques support descriptions with markdown and citation support. The detection field also supports markdown and citations. Additionally, techniques list relevant platforms according to their domain. After a domain has been selected, the user may select the relevant platforms from the dropdown menu.

#### Sub-techniques
Sub-techniques are a more specific description of the adversarial behavior used to achieve a goal. Techniques and sub-techniques are both represented in the techniques section of the application, with sub-techniques nested beneath their parent technique in the "Sub-techniques" section of the page. A technique can be converted to a sub-technique by checking the "sub-technique?" box in the edit interface, after which point parent (non-sub-techniques) techniques can create relationships with them.

#### Domain/Tactic Specific Fields

The set of fields available to edit on a technique differs according to the domains and tactics of the technique. Domain specific fields are displayed in the same row as the domain field, and tactic specific fields are displayed in the same row as the tactics field.

| Field | Domains | Tactics? |  Description |
|:------|:--------|:---------|:-------------|
| Data Sources | Enterprise, ICS | (All Tactics) | Sources of information that may be used to identify the action or result of the action being performed. |
| sub-technique? | Enterprise | (All Tactics) | Is this object a sub-technique? This cannot be changed for sub-techniques with assigned parents, or for parent-techniques with assigned sub-techniques. |
| System Requirements | Enterprise | (All Tactics) | Additional information on requirements the adversary needs to meet or about the state of the system (software, patch level, etc.) that may be required for the technique to work. |
| Permissions Required | Enterprise | Privilege Escalation | The lowest level of permissions the adversary is required to be operating within to perform the technique on a system. |
| Effective Permissions | Enterprise | Privilege Escalation | The level of permissions the adversary will attain by performing the technique. | 
| Defenses Bypassed | Enterprise | Defense Evasion | List of defensive tools, methodologies, or processes the technique can bypass. |
| Remote Support | Enterprise | Execution | Can the technique can be used to execute something on a remote system? |
| Impact Type | Enterprise | Impact | Denotes if the technique can be used for integrity or availability attacks. |
| CAPEC IDs | Enterprise | (All Tactics) | [CAPEC](https://capec.mitre.org/) IDs associated with the technique. |
| MTC IDs | Mobile | (All Tactics) | NIST [Mobile Threat Catalogue](https://pages.nist.gov/mobile-threat-catalogue/) IDs associated with the technique. |
| Tactic Type | Mobile | (All Tactics) | "Post-Adversary Device Access", "Pre-Adversary Device Access", or "Without Adversary Device Access". |


#### Relationships with Techniques

| Relationship Section                       | Description |
|:-----|:----|
| Sub-techniques / Other Sub-techniques      | Sub-techniques of the technique if it is a parent technique, or other sub-techniques of the parent | is a sub-technique.
| Mitigations                                | Mitigations that apply to this technique |
| Procedure Examples                         | Groups and software that use this technique |


### Editing Tactics

Tactics represent the "why" of an ATT&CK technique or sub-technique. It is the adversary’s tactical goal: the reason for performing an action. For example, an adversary may want to achieve credential access. 

Tactics support the standard set of fields, including a description supporting citations and markdown formatting. Tactics must be assigned to a domain before techniques can be assigned to them. The assignment of techniques to tactics can only be done on the techniques page.
#### Relationships with Tactics
Tactics do not have any associated relationships.
### Editing Mitigations

Mitigations represent security concepts and classes of technologies that can be used to prevent a technique or sub-technique from being successfully executed. They support the standard set of fields and must be assigned to a domain. 

A special mitigation published within the Enterprise domain, "Do Not Mitigate," should be used to mark any techniques which should not be mitigated.
#### Relationships with Mitigations

| Relationship Section                    | Description |
|:-----|:----|
| Techniques Addressed by Mitigation      | Techniques the mitigation addresses / mitigates. |

### Editing Groups

Groups are sets of related intrusion activity that are tracked by a common name in the security community. Overlaps between names based on publicly reported associations are tracked using "Associated Groups" (also known as "Aliases").

Groups support the standard set of fields as well as the "Associated Groups" field. Each associated group is tracked using a name and description. The alias description is typically used to hold a set of citations, though plain-text can also be entered alongside citations if additional context is necessary. Alias names cannot be changed after they are added, but the description can be changed by clicking on the entry in the associated groups list.


#### Relationships with Groups

| Relationship Section                    | Description |
|:-----|:----|
| Techniques Used      | Techniques used by the group. Note that this should not include indirect usages through software, which should be expressed by mapping to the software itself. |
| Software Used      | Software used by the group |
### Editing Software

Software is a generic term for custom or commercial code, operating system utilities, open-source software, or other tools used to conduct behavior modeled in ATT&CK. Some instances of software have multiple names associated with the same instance due to various organizations tracking the same set of software by different names. The team makes a best effort to track overlaps between names based on publicly reported associations, which are designated as “Associated Software” on each page (formerly labeled "Aliases").

Software support the standard set of fields as well as the "Associated Software" field. Each associated software is tracked using a name and description. The alias description is typically used to hold a set of citations, though plain-text can also be entered alongside citations if additional context is necessary. Alias names cannot be changed after they are added, but the description can be changed by clicking on the entry in the associated groups list.



#### Types of Software 
Two types of software exist, _malware_ and _tool_:
- *malware*: commercial, custom closed source, or open source software intended to be used for malicious purposes by adversaries.
- *tool*: commercial, open-source, built-in, or publicly available software that could be used by a defender, pen tester, red teamer, or an adversary.

The software type must be selected when creating it and due to limitations of the data model cannot be changed after the software is created. If the type must be changed, create a new object of the other type and _revoke_ the old object with the replacing object.

#### Relationships with Software

| Relationship Section                    | Description |
|:-----|:----|
| Techniques Used      | Techniques used by the group |
| Associated Groups    | Groups that use this software |

### Editing Relationships
Relationships map objects to other objects. Relationships have types, sources, and targets. The source and targets define the objects connected by the relationship, and the type is a verb describing the nature of their relationship. 

| Relationship Type | Valid Source Types | Valid Target Types |
|:-----|:----|:---|
| uses              | Group, Software*  | Software*, Technique |
| mitigates         | Mitigation       | Technique |
| subtechnique-of   | Technique        | Technique |

_\* Relationships cannot be created between two software._

The source and target objects can be changed after the relationship has been created, but the relationship type cannot. Thus could a procedure example be remapped to a new technique based off updated reporting or adjustments to technique scope, for example.

Relationships also have a description to provide additional context or to hold citations of relevant reporting. Like all descriptions, those on relationships support both citations and markdown formatting. Relationships between sub-techniques and techniques however are purely structural and do not support descriptions.




## Further reading
- [Philosophy Paper](https://attack.mitre.org/docs/ATTACK_Design_and_Philosophy_March_2020.pdf): This whitepaper provides an in-depth look at why ATT&CK was created, how it is updated and maintained, and common community uses.