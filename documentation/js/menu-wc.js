'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">attack-workbench-frontend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-1a3c8cfcdba3f2b14715e5e355aa522075eedcd1ab462d87a56d14198694fc19f351a0886334905abbfa18c083723a28f721234bb89f0cd312fdf1aac2a2444f"' : 'data-target="#xs-components-links-module-AppModule-1a3c8cfcdba3f2b14715e5e355aa522075eedcd1ab462d87a56d14198694fc19f351a0886334905abbfa18c083723a28f721234bb89f0cd312fdf1aac2a2444f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-1a3c8cfcdba3f2b14715e5e355aa522075eedcd1ab462d87a56d14198694fc19f351a0886334905abbfa18c083723a28f721234bb89f0cd312fdf1aac2a2444f"' :
                                            'id="xs-components-links-module-AppModule-1a3c8cfcdba3f2b14715e5e355aa522075eedcd1ab462d87a56d14198694fc19f351a0886334905abbfa18c083723a28f721234bb89f0cd312fdf1aac2a2444f"' }>
                                            <li class="link">
                                                <a href="components/AddDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddRelationshipButtonComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddRelationshipButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AdminPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AliasEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AliasEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AliasEditDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AliasEditDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AliasPropertyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AliasPropertyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AliasViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AliasViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AttackIDEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AttackIDEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AttackIDPropertyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AttackIDPropertyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AttackIDViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AttackIDViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CampaignListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CampaignListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CampaignViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CampaignViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CitationEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CitationEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CitationPropertyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CitationPropertyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CitationViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CitationViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CollectionImportComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CollectionImportComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CollectionImportErrorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CollectionImportErrorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CollectionImportReviewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CollectionImportReviewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CollectionImportSummaryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CollectionImportSummaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CollectionIndexImportComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CollectionIndexImportComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CollectionIndexListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CollectionIndexListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CollectionIndexViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CollectionIndexViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CollectionListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CollectionListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CollectionManagerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CollectionManagerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CollectionUpdateDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CollectionUpdateDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CollectionViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CollectionViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfirmationDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfirmationDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DataComponentViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DataComponentViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DataSourceListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DataSourceListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DataSourceViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DataSourceViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DatepickerPropertyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatepickerPropertyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DefaultMarkingDefinitionsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DefaultMarkingDefinitionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DescriptiveDiffComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DescriptiveDiffComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DescriptiveEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DescriptiveEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DescriptivePropertyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DescriptivePropertyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DescriptiveViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DescriptiveViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EmptyListMarkerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmptyListMarkerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExternalReferencesDiffComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExternalReferencesDiffComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExternalReferencesPropertyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExternalReferencesPropertyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExternalReferencesViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExternalReferencesViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GroupListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GroupListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GroupViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GroupViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HelpPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HelpPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HistoryTimelineComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HistoryTimelineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IconViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IconViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IdentityPropertyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IdentityPropertyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LandingPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LandingPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListPropertyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListPropertyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoadingOverlayComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoadingOverlayComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MarkdownViewDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MarkdownViewDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MarkingDefinitionListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MarkingDefinitionListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MarkingDefinitionViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MarkingDefinitionViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MatrixListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MatrixListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MatrixViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MatrixViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MitigationListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MitigationListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MitigationViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MitigationViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MultipleChoiceDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MultipleChoiceDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NamePropertyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NamePropertyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotesEditorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotesEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ObjectStatusComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ObjectStatusComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OrderedListEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrderedListEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OrderedListPropertyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrderedListPropertyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OrderedListViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrderedListViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OrgSettingsPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrgSettingsPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReferenceEditDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReferenceEditDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReferenceManagerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReferenceManagerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RelationshipViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RelationshipViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResourcesDrawerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResourcesDrawerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SaveDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SaveDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SoftwareListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SoftwareListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SoftwareViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SoftwareViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StatementEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatementEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StatementPropertyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatementPropertyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StatementViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatementViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StixDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StixDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StixListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StixListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StixPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StixPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SubheadingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SubheadingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TacticListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TacticListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TacticViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TacticViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TechniqueListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TechniqueListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TechniqueViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TechniqueViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TimestampDiffComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TimestampDiffComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TimestampPropertyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TimestampPropertyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TimestampViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TimestampViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TlpEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TlpEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TlpPropertyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TlpPropertyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TlpViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TlpViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ToolbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ToolbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserAccountsPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserAccountsPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ValidationResultsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ValidationResultsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VersionEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VersionEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VersionPropertyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VersionPropertyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VersionViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VersionViewComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingStixModule.html" data-type="entity-link" >AppRoutingStixModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/CollectionImportedListComponent.html" data-type="entity-link" >CollectionImportedListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StixViewPage.html" data-type="entity-link" >StixViewPage</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ApiConnector.html" data-type="entity-link" >ApiConnector</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppPage.html" data-type="entity-link" >AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/Campaign.html" data-type="entity-link" >Campaign</a>
                            </li>
                            <li class="link">
                                <a href="classes/CitationParseResult.html" data-type="entity-link" >CitationParseResult</a>
                            </li>
                            <li class="link">
                                <a href="classes/Collection.html" data-type="entity-link" >Collection</a>
                            </li>
                            <li class="link">
                                <a href="classes/CollectionDiffCategories.html" data-type="entity-link" >CollectionDiffCategories</a>
                            </li>
                            <li class="link">
                                <a href="classes/CollectionIndex.html" data-type="entity-link" >CollectionIndex</a>
                            </li>
                            <li class="link">
                                <a href="classes/CollectionReference.html" data-type="entity-link" >CollectionReference</a>
                            </li>
                            <li class="link">
                                <a href="classes/CollectionVersion.html" data-type="entity-link" >CollectionVersion</a>
                            </li>
                            <li class="link">
                                <a href="classes/CustomEncoder.html" data-type="entity-link" >CustomEncoder</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataComponent.html" data-type="entity-link" >DataComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataSource.html" data-type="entity-link" >DataSource</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExternalReferences.html" data-type="entity-link" >ExternalReferences</a>
                            </li>
                            <li class="link">
                                <a href="classes/Group.html" data-type="entity-link" >Group</a>
                            </li>
                            <li class="link">
                                <a href="classes/Identity.html" data-type="entity-link" >Identity</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinkByIdParseResult.html" data-type="entity-link" >LinkByIdParseResult</a>
                            </li>
                            <li class="link">
                                <a href="classes/MarkingDefinition.html" data-type="entity-link" >MarkingDefinition</a>
                            </li>
                            <li class="link">
                                <a href="classes/Matrix.html" data-type="entity-link" >Matrix</a>
                            </li>
                            <li class="link">
                                <a href="classes/Mitigation.html" data-type="entity-link" >Mitigation</a>
                            </li>
                            <li class="link">
                                <a href="classes/Note.html" data-type="entity-link" >Note</a>
                            </li>
                            <li class="link">
                                <a href="classes/Relationship.html" data-type="entity-link" >Relationship</a>
                            </li>
                            <li class="link">
                                <a href="classes/Serializable.html" data-type="entity-link" >Serializable</a>
                            </li>
                            <li class="link">
                                <a href="classes/Software.html" data-type="entity-link" >Software</a>
                            </li>
                            <li class="link">
                                <a href="classes/StixObject.html" data-type="entity-link" >StixObject</a>
                            </li>
                            <li class="link">
                                <a href="classes/Tactic.html" data-type="entity-link" >Tactic</a>
                            </li>
                            <li class="link">
                                <a href="classes/Technique.html" data-type="entity-link" >Technique</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserAccount.html" data-type="entity-link" >UserAccount</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidationData.html" data-type="entity-link" >ValidationData</a>
                            </li>
                            <li class="link">
                                <a href="classes/VersionNumber.html" data-type="entity-link" >VersionNumber</a>
                            </li>
                            <li class="link">
                                <a href="classes/VersionReference.html" data-type="entity-link" >VersionReference</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthenticationService.html" data-type="entity-link" >AuthenticationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditorService.html" data-type="entity-link" >EditorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RestApiConnectorService.html" data-type="entity-link" >RestApiConnectorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SidebarService.html" data-type="entity-link" >SidebarService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TitleService.html" data-type="entity-link" >TitleService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/AuthInterceptor.html" data-type="entity-link" >AuthInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthorizationGuard.html" data-type="entity-link" >AuthorizationGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AddDialogConfig.html" data-type="entity-link" >AddDialogConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AddRelationshipButtonConfig.html" data-type="entity-link" >AddRelationshipButtonConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AliasEditDialogConfig.html" data-type="entity-link" >AliasEditDialogConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AliasPropertyConfig.html" data-type="entity-link" >AliasPropertyConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AttackIDPropertyConfig.html" data-type="entity-link" >AttackIDPropertyConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CitationPropertyConfig.html" data-type="entity-link" >CitationPropertyConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CollectionImportSummaryConfig.html" data-type="entity-link" >CollectionImportSummaryConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CollectionIndexViewConfig.html" data-type="entity-link" >CollectionIndexViewConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CollectionListConfig.html" data-type="entity-link" >CollectionListConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CollectionUpdateConfig.html" data-type="entity-link" >CollectionUpdateConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConfirmationDialogConfig.html" data-type="entity-link" >ConfirmationDialogConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DatepickerPropertyConfig.html" data-type="entity-link" >DatepickerPropertyConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DescriptivePropertyConfig.html" data-type="entity-link" >DescriptivePropertyConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExternalReference.html" data-type="entity-link" >ExternalReference</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExternalReferencesPropertyConfig.html" data-type="entity-link" >ExternalReferencesPropertyConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FilterGroup.html" data-type="entity-link" >FilterGroup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FilterValue.html" data-type="entity-link" >FilterValue</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HistoryEvent.html" data-type="entity-link" >HistoryEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IconViewConfig.html" data-type="entity-link" >IconViewConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IdentityPropertyConfig.html" data-type="entity-link" >IdentityPropertyConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListPropertyConfig.html" data-type="entity-link" >ListPropertyConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MarkdownHeadingAnchor.html" data-type="entity-link" >MarkdownHeadingAnchor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MarkownViewDialogConfig.html" data-type="entity-link" >MarkownViewDialogConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MultipleChoiceDialogConfig.html" data-type="entity-link" >MultipleChoiceDialogConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NamePropertyConfig.html" data-type="entity-link" >NamePropertyConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Namespace.html" data-type="entity-link" >Namespace</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OrderedListPropertyConfig.html" data-type="entity-link" >OrderedListPropertyConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Paginated.html" data-type="entity-link" >Paginated</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReferenceEditConfig.html" data-type="entity-link" >ReferenceEditConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SaveDialogConfig.html" data-type="entity-link" >SaveDialogConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StatementPropertyConfig.html" data-type="entity-link" >StatementPropertyConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StixListConfig.html" data-type="entity-link" >StixListConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StixViewConfig.html" data-type="entity-link" >StixViewConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/tabDefinition.html" data-type="entity-link" >tabDefinition</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TimestampPropertyConfig.html" data-type="entity-link" >TimestampPropertyConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TlpPropertyConfig.html" data-type="entity-link" >TlpPropertyConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ValidationFieldData.html" data-type="entity-link" >ValidationFieldData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VersionPropertyConfig.html" data-type="entity-link" >VersionPropertyConfig</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});