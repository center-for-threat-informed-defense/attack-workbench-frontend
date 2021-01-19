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

## 19 JAN 2021
### ATT&CK Workbench version 00.01.00
#### New Features
- Created pages to view and browse matrices, techniques, tactics, mitigations, groups, and software. Searching, filtering, and sorting are supported on these pages.
- Created object view pages for matrix, technique, tactic, mitigation, group, and software objects and their properties.
- Added the ability to browse and import collection indexes.
    - Collection indexes can be imported via URL or file upload.
    - A preview of the collection index is shown before confirming the import and is sorted by domain.
- Added the ability to import, view, and subscribe to collections.
    - Collections can be imported via URL or file upload.
    - A preview of the collection and its contents is shown before confirming the import. At this step, users can view individual objects and remove specific items for import.
    - Users can view objects that were changed or added in a new version of an imported collection.