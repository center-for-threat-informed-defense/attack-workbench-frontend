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

## 19 January, 2021
### ATT&CK Workbench version 00.01.00
#### New Features
- Created object view pages for matrix, technique, tactic, mitigation, group, and software objects.
- Added the ability to browse and import collection indexes.
    - Collection indexes can be imported via URL.
    - A preview of the collection index is shown before confirming the import.
- Added the ability to import, view, and subscribe to collections.
    - Collections listed within an index can be subscribed to, which will pull new versions when they are published.
    - Collections can also be manually imported via URL. When importing, a preview of the collection and its contents is shown before confirming the import. At this step, users can preview the objects in the collection and select which ones they want to import. Changes in the import are displayed relative to the state of the knowledge base similar to the update pages on the [ATT&CK Website](https://attack.mitre.org/resources/updates/).
    - An interface provides the ability to review prior imports, which provides a list of changes at the time of the import identical to that shown during the import of the collection.