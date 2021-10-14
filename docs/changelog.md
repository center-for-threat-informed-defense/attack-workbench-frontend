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

## Changes staged on develop

### ATT&CK Workbench version 1.1.0

ATT&CK Workbench v1.1.0 includes support for ATT&CK Spec v2.1.0 and coincides with the ATT&CK v10.0 release. Users who do not upgrade to Workbench v1.1.0 may encounter issues with the new ATT&CK data:

-   If the user added the ATT&CK collection index prior to the ATT&CK v10.0 release, it may lose track of imported Enterprise collections. These collections can still be found in the "imported collections" tab of the collection manager, but won't be reflected in the collection manager. Collection subscriptions for Enterprise may also be lost.
-   If the user imports ATT&CK v10.0, data sources and data components will not be imported into their local knowledge base. You can re-import the collection after upgrading workbench to v1.1.0 to acquire the data sources and data components even if you had already imported it when running a prior version of Workbench.

#### Improvements in 1.1.0

-   Added object type documentation on list pages. See [frontend#221](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/221).
-   Improved the flexibility and robustness of collection imports:
    -   Workbench will now check the ATT&CK Spec version of imported data and warn the user if the ATT&CK Spec version is unsupported (e.x if the Workbench instance is too outdated to support the data it is trying to import). The user can choose to bypass this warning.
    -   Workbench can now import the same collection multiple times in case objects in the initial import could not be imported due to an error.
    -   Workbench can now import STIX bundles that don't contain a collection object. This is not recommended however since the results of such an import (the list of imported objects) will not be recorded for future reference.
    -   The user will now be provided with a downloadable list of objects that could not be saved (and the reason why) in the event of import errors.
    -   REST API will now log import errors to the console.
    -   Frontend will now log import errors to the console when the application environment is not set to production.

#### Fixes in 1.1.0

-   Fixed an issue where the navigation header could be inaccessible when navigating within the application or when the page resized due to user input.
-   Frontend will no longer claim objects were imported when they were actually discarded due to import errors such as spec violations.
-   Imported STIX bundles will no longer require (but still allow) the `spec_version` field on the bundle itself. This was causing issues importing collections created by the Workbench. Objects within the bundle still require the `spec_version` field per the STIX 2.1 spec. See [rest-api#103](https://github.com/center-for-threat-informed-defense/attack-workbench-rest-api/issues/103).

## 20 August 2021

### ATT&CK Workbench version 1.0.2

#### Fixes in 1.0.2

-   Error snackbars will now show appropriate messages instead of `[object ProgressEvent]` when communication with the REST API is interrupted or cannot be established. See [frontend#227](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/227).
-   Fixed a bug where tactic shortnames were computed incorrectly for tactics with more than one space in the name (E.g `"Command and Control"`). See [frontend#239](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/239).
    -   If you have edited a technique under a tactic with more than one space in the name, remove and re-add the tactic under the technique edit interface to ensure that the tactic reference is formatted properly.
    -   If you have created a tactic with more than one space in the name, save a new version of the tactic and the proper shortname should be saved. You do not need to make any edits when saving the tactic page for the shortname to be fixed.

## 8 July 2021

### ATT&CK Workbench version 1.0.1

#### Improvements in 1.0.1

-   Added a system for configuring the Collection Manager with self-signed certs when using the docker setup. Documentation for this configuration will be improved in a subsequent release.

#### Fixes in 1.0.1

-   Fixed an error encountered when using the `attack-objects` API with large datasets. This error was preventing users from loading the "create a collection" page when Enterprise ATT&CK collections were imported. See [rest-api#87](https://github.com/center-for-threat-informed-defense/attack-workbench-rest-api/issues/87).

## 21 June 2021

### ATT&CK Workbench version 1.0.0

#### Improvements in 1.0.0

-   Performance improvements when adding, editing, and validating relationships.
-   Improved error messages when importing collections that are too large or malformed. See [frontend#198](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/198).
-   Improved page titles and breadcrumb on "object not found" pages.
-   User can now import collections from file. See [frontend#207](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/207).
-   Collection index update interval is now set in the REST API configuration instead of hardcoded in the frontend. See [frontend#200](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/200).

#### Fixes in 1.0.0

-   Fixed vertically misaligned timestamps across several UIs.
-   Fixed missing timestamp on collection version lists within collection indexes.
-   Fixed object status popover showing the wrong status if opened too soon after the page loads. Also improved performance of the status popover code.
-   Collection import UI no longer gets stuck if it runs into a problem fetching/importing/previewing the collection. See [frontend#198](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/198)
-   Object status popover now closes properly when the user starts editing the object. See [frontend#199](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/199).

## 7 May 2021

### ATT&CK Workbench version 0.4.0

#### Improvements in 0.4.0

-   Added a favicon. See [frontend#137](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/137).
-   Added dynamic page title to make it easier to distinguish multiple Workbench tabs in the browser. See [frontend#130](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/130).
-   Added a list of recommended indexes available when adding a collection index. See [frontend#194](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/194).
-   Added ability to set workflow state when objects are saved. See [frontend#184](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/184).
-   Updated occurrences of "aliases" to "associated groups" or "associated software" for consistency across the application. See [frontend#176](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/176).
-   Improved logging and added log level to environment configuration to suppress unnecessary logs from production deployments. See [frontend#209](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/209).
-   Updated the reference editor to enforce correct formatting when creating a new reference. See [frontend#177](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/177).

## 21 April 2021

### ATT&CK Workbench version 0.3.0

#### New Features in 0.3.0

-   Added attribution of edits and tracking of organization identity. See [frontend#61](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/124) and [frontend#182](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/61).
-   Added ability to revoke and deprecate objects. See [frontend#164](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/164).
-   Added tracking of workflow state. See [frontend#3](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/3).
-   Added ability to create and edit collections. See [frontend#4](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/4), [frontend#5](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/5), and [frontend#112](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/112).
-   Added support and documentation for [ATT&CK Navigator](https://github.com/mitre-attack/attack-navigator) integration. See [frontend#153](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/153).
-   Added support and documentation for [ATT&CK Website](https://github.com/mitre-attack/attack-website/) integration. See [frontend#152](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/152).

#### Improvements in 0.3.0

-   Improved display of object domains. See [frontend#166](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/166).

## 19 March 2021

### ATT&CK Workbench version 0.2.0

#### New Features in 0.2.0

-   Added support for MTC and CAPEC IDs. See [frontend#124](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/124).
-   Added ability to create and edit objects. See [frontend#44](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/44) and [frontend#145](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/145).
    -   Added ability to edit group/software aliases. See [frontend#118](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/118).
    -   Added ability to edit various list properties such as platforms, tactics, and domains. See [frontend#31](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/31).
    -   Added rich-text description editor. See [frontend#32](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/32).
    -   Added ability to convert techniques to sub-techniques, and vice versa.
    -   Added ability to edit ATT&CK IDs. See [frontend#55](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/55).
    -   Added validation system to warn user of malformed data.
    -   Added ability to reorder tactics on matrices. See [frontend#116](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/116).
    -   Added ability to edit object version numbers, and a UI for incrementing versions when objects are saved. See [frontend#56](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/56).
-   Added ability to create and edit notes (annotations) on objects. See [frontend#59](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/59).
-   Added citations/references support.
    -   Added automatic detection of citations on descriptions and aliases. See [frontend#115](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/115).
    -   Added references manager tool. See [frontend#115](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/115) and [frontend#133](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/133).

#### Improvements in 0.2.0

-   Lists of objects can now be searched and filtered. See [frontend#128](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/128) and [frontend#127](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/127).
-   Lists of objects now display ATT&CK IDs when relevant. See [frontend#119](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/119).
-   When viewing an object, fields which have no value(s) will now be hidden. See [frontend#120](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/120).
-   Improved display of sub-techniques. See [frontend#125](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/125).
-   Layout and formatting improvements to [USAGE](/docs/usage.md) document

#### Fixes in 0.2.0

-   Fixed broken pagination on relationship tables. See [frontend#126](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/126).

## 16 February 2021

### ATT&CK Workbench version 0.1.1

#### New Features in 0.1.1

-   Added Dockerfiles, docker-compose, [and documentation on how to use them](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/tree/master/docs/docker-compose.md). See [frontend#108](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/108), [frontend#109](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/issues/109) [rest-api#14](https://github.com/center-for-threat-informed-defense/attack-workbench-rest-api/issues/14), and [collection-manager#13](https://github.com/center-for-threat-informed-defense/attack-workbench-collection-manager/issues/13).

#### Fixes in 0.1.1

-   Fixed a crash that could occur with specific queries on the REST API. See [rest-api#28](https://github.com/center-for-threat-informed-defense/attack-workbench-rest-api/issues/28).

## 19 January 2021

### ATT&CK Workbench version 0.1.0

#### New Features in 0.1.0

-   Created object view pages for matrix, technique, tactic, mitigation, group, and software objects.
-   Added the ability to browse and import collection indexes.
    -   Collection indexes can be imported via URL.
    -   A preview of the collection index is shown before confirming the import.
-   Added the ability to import, view, and subscribe to collections.
    -   Collections listed within an index can be subscribed to, which will pull new versions when they are published.
    -   Collections can also be manually imported via URL. When importing, a preview of the collection and its contents is shown before confirming the import. At this step, users can preview the objects in the collection and select which ones they want to import. Changes in the import are displayed relative to the state of the knowledge base similar to the update pages on the [ATT&CK Website](https://attack.mitre.org/resources/updates/).
    -   An interface provides the ability to review prior imports, which provides a list of changes at the time of the import identical to that shown during the import of the collection.
