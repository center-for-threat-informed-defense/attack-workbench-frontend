<!--    CHANGELOG FORMAT                                                -->
<!--                                                                    -->
<!--    Completed Entry template:                                       -->
<!--                                                                    -->
<!--    ## Date in DD MMM YYYY format                                   -->
<!--    ### ATT&CK Workbench version ##.##.##                           -->
<!--    #### New Features                                               -->
<!--    #### Improvements                                               -->
<!--    #### Fixes                                                      -->
<!--                                                                    -->
<!--    Entries for pull request template:                              -->
<!--                                                                    -->
<!--    ## Changes staged on develop                                    -->
<!--    #### New Features                                               -->
<!--    #### Improvements                                               -->
<!--    #### Fixes                                                      -->
<!--                                                                    -->
<!--                                                                    -->
<!--    VERSION NUMBERING                                               -->
<!--                                                                    -->
<!--    app versions are set up in a major.minor.patch format:          -->
<!--    MAJOR updates are when we release major new features or         -->
<!--          pages                                                     -->
<!--    MINOR updates are when we improve a small number of             -->
<!--          existing features                                         -->
<!--    PATCH updates are when a bugfix is made without the             -->
<!--          addition of notable features. When PATCH is 0 it can      -->
<!--          be omitted                                                -->
<!--                                                                    -->
<!--    Versions must match across repos, and must be reflected in      -->
<!--    each repo's package.json file's version marking.                -->

# Changelog
## 19 March 2021

### ATT&CK Workbench version 0.2.0
#### New Features in 0.2.0
- Added support for MTC and CAPEC IDs. See [frontend#124](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/124).
- Added ability to create and edit objects. See [frontend#44](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/44) and [frontend#145](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/145).
    - Added ability to edit group/software aliases. See [frontend#118](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/118).
    - Added ability to edit various list properties such as platforms, tactics, and domains. See [frontend#31](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/31).
    - Added rich-text description editor. See [frontend#32](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/32).
    - Added ability to convert techniques to sub-techniques, and vice versa.
    - Added ability to edit ATT&CK IDs. See [frontend#55](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/55).
    - Added validation system to warn user of malformed data.
    - Added ability to reorder tactics on matrices. See [frontend#116](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/116).
    - Added ability to edit object version numbers, and a UI for incrementing versions when objects are saved. See [frontend#56](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/56).
- Added ability to create and edit notes (annotations) on objects. See [frontend#59](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/59).
- Added citations/references support.
    - Added automatic detection of citations on descriptions and aliases. See [frontend#115](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/115).
    - Added references manager tool. See [frontend#115](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/115) and [frontend#133](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/133).

#### Improvements in 0.2.0
- Lists of objects can now be searched and filtered. See [frontend#128](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/128) and [frontend#127](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/127).
- Lists of objects now display ATT&CK IDs when relevant. See [frontend#119](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/119).
- When viewing an object, fields which have no value(s) will now be hidden. See [frontend#120](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/120).
- Improved display of sub-techniques. See [frontend#125](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/125).
- Layout and formatting improvements to [USAGE](/docs/usage.md) document

#### Fixes in 0.2.0
- Fixed broken pagination on relationship tables. See [frontend#126](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/126).

## 16 February 2021
### ATT&CK Workbench version 0.1.1
#### New Features in 0.1.1
- Added Dockerfiles, docker-compose, [and documentation on how to use them](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/tree/master/docs/docker-compose.md). See [frontend#108](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/108), [frontend#109](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/109) [rest-api#14](https://github.com/center-for-threat-informed-defense/attack-workbench-rest-api/issues/14), and [collection-manager#13](https://github.com/center-for-threat-informed-defense/attack-workbench-collection-manager/issues/13).

#### Fixes in 0.1.1
- Fixed a crash that could occur with specific queries on the REST API. See [rest-api#28](https://github.com/center-for-threat-informed-defense/attack-workbench-rest-api/issues/28).

## 19 January 2021
### ATT&CK Workbench version 0.1.0
#### New Features in 0.1.0
- Created object view pages for matrix, technique, tactic, mitigation, group, and software objects.
- Added the ability to browse and import collection indexes.
    - Collection indexes can be imported via URL.
    - A preview of the collection index is shown before confirming the import.
- Added the ability to import, view, and subscribe to collections.
    - Collections listed within an index can be subscribed to, which will pull new versions when they are published.
    - Collections can also be manually imported via URL. When importing, a preview of the collection and its contents is shown before confirming the import. At this step, users can preview the objects in the collection and select which ones they want to import. Changes in the import are displayed relative to the state of the knowledge base similar to the update pages on the [ATT&CK Website](https://attack.mitre.org/resources/updates/).
    - An interface provides the ability to review prior imports, which provides a list of changes at the time of the import identical to that shown during the import of the collection.