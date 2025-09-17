import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';

// angular imports
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule, inject, provideAppInitializer } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingStixModule } from './app-routing-stix.module';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './services/helpers/auth.interceptor';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

// material imports
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

// other library imports
import { MtxPopoverModule } from '@ng-matero/extensions/popover';
import { AutosizeModule } from 'ngx-autosize';
import { JDENTICON_CONFIG, NgxJdenticonModule } from 'ngx-jdenticon';
import { MarkdownModule } from 'ngx-markdown';

// custom components
import { AddDialogComponent } from './components/add-dialog/add-dialog.component';
import { AddRelationshipButtonComponent } from './components/add-relationship-button/add-relationship-button.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { CollectionImportSummaryComponent } from './components/collection-import-summary/collection-import-summary.component';
import { CollectionUpdateDialogComponent } from './components/collection-update-dialog/collection-update-dialog.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { EmptyListMarkerComponent } from './components/empty-list-marker/empty-list-marker.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { MarkdownViewDialogComponent } from './components/markdown-view-dialog/markdown-view-dialog.component';
import { MultipleChoiceDialogComponent } from './components/multiple-choice-dialog/multiple-choice-dialog.component';
import { ReferenceEditDialogComponent } from './components/reference-edit-dialog/reference-edit-dialog.component';
import { HistoryTimelineComponent } from './components/resources-drawer/history-timeline/history-timeline.component';
import { ReferenceSidebarComponent } from './components/resources-drawer/reference-sidebar/reference-sidebar.component';
import { ResourcesDrawerComponent } from './components/resources-drawer/resources-drawer.component';
import { SearchComponent } from './components/resources-drawer/search/search.component';
import { SaveDialogComponent } from './components/save-dialog/save-dialog.component';
import { SubheadingComponent } from './components/subheading/subheading.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ValidationResultsComponent } from './components/validation-results/validation-results.component';
import { VersionPopoverComponent } from './components/version-popover/version-popover.component';

// STIX components
import { StixListComponent } from './components/stix/stix-list/stix-list.component';
import { UsersListComponent } from './components/users-list/users-list.component';

import { ExternalReferencesPropertyComponent } from './components/stix/external-references-property/external-references-property.component';
import { ExternalReferencesViewComponent } from './components/stix/external-references-property/external-references-view/external-references-view.component';

import { DescriptiveEditComponent } from './components/stix/descriptive-property/descriptive-edit/descriptive-edit.component';
import { DescriptivePropertyComponent } from './components/stix/descriptive-property/descriptive-property.component';
import { DescriptiveViewComponent } from './components/stix/descriptive-property/descriptive-view/descriptive-view.component';

import { TimestampPropertyComponent } from './components/stix/timestamp-property/timestamp-property.component';
import { TimestampViewComponent } from './components/stix/timestamp-property/timestamp-view/timestamp-view.component';

import { StatementEditComponent } from './components/stix/statement-property/statement-edit/statement-edit.component';
import { StatementPropertyComponent } from './components/stix/statement-property/statement-property.component';
import { StatementViewComponent } from './components/stix/statement-property/statement-view/statement-view.component';

import { TlpEditComponent } from './components/stix/tlp-property/tlp-edit/tlp-edit.component';
import { TlpPropertyComponent } from './components/stix/tlp-property/tlp-property.component';
import { TlpViewComponent } from './components/stix/tlp-property/tlp-view/tlp-view.component';

import { AttackidDiffComponent } from './components/stix/attackid-property/attackid-diff/attackid-diff.component';
import { AttackIDEditComponent } from './components/stix/attackid-property/attackid-edit/attackid-edit.component';
import { AttackIDPropertyComponent } from './components/stix/attackid-property/attackid-property.component';
import { AttackIDViewComponent } from './components/stix/attackid-property/attackid-view/attackid-view.component';

import { StixIDPropertyComponent } from './components/stix/stixid-property/stixid-property.component';

import { ListDiffComponent } from './components/stix/list-property/list-diff/list-diff.component';
import { ListEditComponent } from './components/stix/list-property/list-edit/list-edit.component';
import { ListPropertyComponent } from './components/stix/list-property/list-property.component';
import { ListViewComponent } from './components/stix/list-property/list-view/list-view.component';

import { VersionDiffComponent } from './components/stix/version-property/version-diff/version-diff.component';
import { VersionEditComponent } from './components/stix/version-property/version-edit/version-edit.component';
import { VersionPropertyComponent } from './components/stix/version-property/version-property.component';
import { VersionViewComponent } from './components/stix/version-property/version-view/version-view.component';

import { NamePropertyComponent } from './components/stix/name-property/name-property.component';

import { StringPropertyComponent } from './components/stix/string-property/string-property.component';

import { DatepickerPropertyComponent } from './components/stix/datepicker-property/datepicker-property.component';

import { AliasDiffComponent } from './components/stix/alias-property/alias-diff/alias-diff.component';
import { AliasEditDialogComponent } from './components/stix/alias-property/alias-edit/alias-edit-dialog/alias-edit-dialog.component';
import { AliasEditComponent } from './components/stix/alias-property/alias-edit/alias-edit.component';
import { AliasPropertyComponent } from './components/stix/alias-property/alias-property.component';
import { AliasViewComponent } from './components/stix/alias-property/alias-view/alias-view.component';

import { SubtypeDialogComponent } from './components/stix/subtype-property/subtype-dialog/subtype-dialog.component';
import { SubtypeEditComponent } from './components/stix/subtype-property/subtype-edit/subtype-edit.component';
import { SubtypePropertyComponent } from './components/stix/subtype-property/subtype-property.component';
import { SubtypeViewComponent } from './components/stix/subtype-property/subtype-view/subtype-view.component';

import { OrderedListEditComponent } from './components/stix/ordered-list-property/ordered-list-edit/ordered-list-edit.component';
import { OrderedListPropertyComponent } from './components/stix/ordered-list-property/ordered-list-property.component';
import { OrderedListViewComponent } from './components/stix/ordered-list-property/ordered-list-view/ordered-list-view.component';

import { IconViewComponent } from './components/icon-view/icon-view.component';
import { ObjectStatusComponent } from './components/object-status/object-status.component';
import { RecentActivityComponent } from './components/recent-activity/recent-activity.component';
import { NotesEditorComponent } from './components/resources-drawer/notes-editor/notes-editor.component';
import { IdentityPropertyComponent } from './components/stix/identity-property/identity-property.component';

import { CitationEditComponent } from './components/stix/citation-property/citation-edit/citation-edit.component';
import { CitationPropertyComponent } from './components/stix/citation-property/citation-property.component';
import { CitationViewComponent } from './components/stix/citation-property/citation-view/citation-view.component';

// views
import { HelpPageComponent } from './views/help-page/help-page.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { DashboardPageComponent } from './views/dashboard-page/dashboard-page.component';
import { OrgSettingsPageComponent } from './views/dashboard-page/org-settings-page/org-settings-page.component';
import { UserAccountsPageComponent } from './views/dashboard-page/user-accounts-page/user-accounts-page.component';
import { DefaultMarkingDefinitionsComponent } from './views/dashboard-page/default-marking-definitions/default-marking-definitions.component';
import { ProfilePageComponent } from './views/profile-page/profile-page.component';
import { ReferenceManagerComponent } from './views/reference-manager/reference-manager.component';

import { StixDialogComponent } from './views/stix/stix-dialog/stix-dialog.component';
import { StixPageComponent } from './views/stix/stix-page/stix-page.component';

import { CollectionManagerComponent } from './views/collection-manager/collection-manager.component';

import { CollectionIndexImportComponent } from './views/stix/collection/collection-index/collection-index-import/collection-index-import.component';
import { CollectionIndexListComponent } from './views/stix/collection/collection-index/collection-index-list/collection-index-list.component';
import { CollectionIndexViewComponent } from './views/stix/collection/collection-index/collection-index-view/collection-index-view.component';

import { CollectionImportErrorComponent } from './views/stix/collection/collection-import/collection-import-error/collection-import-error.component';
import { CollectionImportReviewComponent } from './views/stix/collection/collection-import/collection-import-review/collection-import-review.component';
import { CollectionImportComponent } from './views/stix/collection/collection-import/collection-import-workflow/collection-import.component';
import { CollectionListComponent } from './views/stix/collection/collection-list/collection-list.component';
import { CollectionViewComponent } from './views/stix/collection/collection-view/collection-view.component';

import { TacticCellComponent } from './components/matrix/tactic-cell/tactic-cell.component';
import { TechniqueCellComponent } from './components/matrix/technique-cell/technique-cell.component';
import { NotesPageComponent } from './views/notes-page/notes-page.component';
import { AssetViewComponent } from './views/stix/asset-view/asset-view.component';
import { CampaignViewComponent } from './views/stix/campaign-view/campaign-view.component';
import { DataComponentViewComponent } from './views/stix/data-component-view/data-component-view.component';
import { DataSourceViewComponent } from './views/stix/data-source-view/data-source-view.component';
import { GroupViewComponent } from './views/stix/group-view/group-view.component';
import { MarkingDefinitionViewComponent } from './views/stix/marking-definition-view/marking-definition-view.component';
import { MatrixFlatComponent } from './views/stix/matrix/matrix-flat/matrix-flat.component';
import { MatrixSideComponent } from './views/stix/matrix/matrix-side/matrix-side.component';
import { MatrixViewComponent } from './views/stix/matrix/matrix-view/matrix-view.component';
import { MitigationViewComponent } from './views/stix/mitigation-view/mitigation-view.component';
import { RelationshipViewComponent } from './views/stix/relationship-view/relationship-view.component';
import { SoftwareViewComponent } from './views/stix/software-view/software-view.component';
import { TacticViewComponent } from './views/stix/tactic-view/tactic-view.component';
import { TechniqueViewComponent } from './views/stix/technique-view/technique-view.component';

import { TeamsListPageComponent } from './views/dashboard-page/teams/teams-list-page/teams-list-page.component';
import { TeamsViewPageComponent } from './views/dashboard-page/teams/teams-view-page/teams-view-page.component';
import { CreateNewDialogComponent } from './components/create-new-dialog/create-new-dialog.component';

import { ContributorEditDialogComponent } from './components/contributor-edit-dialog/contributor-edit-dialog.component';
import { ContributorsPageComponent } from './views/contributors-page/contributors-page.component';

import { OutdatedContentWarningComponent } from './components/outdated-content-warning/outdated-content-warning.component';
import { PropertyDiffComponent } from './components/property-diff/property-diff.component';
import { StixJsonDialogComponent } from './components/stix-json-dialog/stix-json-dialog.component';
import { BooleanPropertyComponent } from './components/stix/boolean-property/boolean-property.component';
import { CitationDiffComponent } from './components/stix/citation-property/citation-diff/citation-diff.component';
import { DescriptiveDiffComponent } from './components/stix/descriptive-property/descriptive-diff/descriptive-diff.component';
import { ExternalReferencesDiffComponent } from './components/stix/external-references-property/external-references-diff/external-references-diff.component';
import { LogSourceReferenceDialogComponent } from './components/stix/log-source-reference-property/log-source-reference-dialog/log-source-reference-dialog.component';
import { LogSourceReferenceDiffComponent } from './components/stix/log-source-reference-property/log-source-reference-diff/log-source-reference-diff.component';
import { LogSourceReferenceEditComponent } from './components/stix/log-source-reference-property/log-source-reference-edit/log-source-reference-edit.component';
import { LogSourceReferencePropertyComponent } from './components/stix/log-source-reference-property/log-source-reference-property.component';
import { LogSourceReferenceViewComponent } from './components/stix/log-source-reference-property/log-source-reference-view/log-source-reference-view.component';
import { OrderedListDiffComponent } from './components/stix/ordered-list-property/ordered-list-diff/ordered-list-diff.component';
import { StatementDiffComponent } from './components/stix/statement-property/statement-diff/statement-diff.component';
import { SubtypeDiffComponent } from './components/stix/subtype-property/subtype-diff/subtype-diff.component';
import { TlpDiffComponent } from './components/stix/tlp-property/tlp-diff/tlp-diff.component';
import { StreamProgressComponent } from './components/stream-progress/stream-progress.component';
import { AppConfigService } from './services/config/app-config.service';
import { AnalyticViewComponent } from './views/stix/analytic-view/analytic-view.component';
import { DetectionStrategyViewComponent } from './views/stix/detection-strategy-view/detection-strategy-view.component';
import { LogSourceViewComponent } from './views/stix/log-source-view/log-source-view.component';
import { StixListPageComponent } from './views/stix/stix-list-page/stix-list-page.component';

export function initConfig(appConfigService: AppConfigService) {
  return () => appConfigService.loadAppConfig();
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoadingOverlayComponent,
    ToolbarComponent,
    ResourcesDrawerComponent,
    SubheadingComponent,
    ConfirmationDialogComponent,
    EmptyListMarkerComponent,
    MarkdownViewDialogComponent,
    CollectionImportSummaryComponent,
    SaveDialogComponent,
    AddDialogComponent,
    DeleteDialogComponent,
    HistoryTimelineComponent,
    ReferenceSidebarComponent,
    ReferenceEditDialogComponent,
    MultipleChoiceDialogComponent,
    ValidationResultsComponent,
    AddRelationshipButtonComponent,
    CollectionUpdateDialogComponent,
    StixListComponent,
    DescriptivePropertyComponent,
    DescriptiveViewComponent,
    DescriptiveEditComponent,
    ExternalReferencesPropertyComponent,
    ExternalReferencesViewComponent,
    TimestampPropertyComponent,
    TimestampViewComponent,
    StatementPropertyComponent,
    StatementViewComponent,
    StatementEditComponent,
    StringPropertyComponent,
    TlpPropertyComponent,
    TlpViewComponent,
    TlpEditComponent,
    AttackIDPropertyComponent,
    AttackIDEditComponent,
    AttackIDViewComponent,
    AttackidDiffComponent,
    StixIDPropertyComponent,
    ListPropertyComponent,
    ListEditComponent,
    ListViewComponent,
    ListDiffComponent,
    VersionPropertyComponent,
    VersionEditComponent,
    VersionViewComponent,
    VersionDiffComponent,
    NamePropertyComponent,
    DatepickerPropertyComponent,
    IconViewComponent,
    LandingPageComponent,
    HelpPageComponent,
    DashboardPageComponent,
    OrgSettingsPageComponent,
    UserAccountsPageComponent,
    DefaultMarkingDefinitionsComponent,
    ProfilePageComponent,
    ReferenceManagerComponent,
    StixDialogComponent,
    StixPageComponent,
    CollectionListComponent,
    CollectionViewComponent,
    CollectionManagerComponent,
    CollectionIndexListComponent,
    CollectionIndexViewComponent,
    CollectionIndexImportComponent,
    CollectionImportComponent,
    CollectionImportReviewComponent,
    CollectionImportErrorComponent,
    RelationshipViewComponent,
    GroupViewComponent,
    MatrixViewComponent,
    MatrixSideComponent,
    MatrixFlatComponent,
    TacticCellComponent,
    TechniqueCellComponent,
    MitigationViewComponent,
    SoftwareViewComponent,
    TacticViewComponent,
    TechniqueViewComponent,
    AliasPropertyComponent,
    AliasViewComponent,
    AliasEditComponent,
    AliasDiffComponent,
    AliasEditDialogComponent,
    OrderedListPropertyComponent,
    OrderedListViewComponent,
    OrderedListEditComponent,
    NotesEditorComponent,
    ObjectStatusComponent,
    RecentActivityComponent,
    IdentityPropertyComponent,
    DataSourceViewComponent,
    DataComponentViewComponent,
    MarkingDefinitionViewComponent,
    CampaignViewComponent,
    CitationPropertyComponent,
    CitationViewComponent,
    CitationEditComponent,
    NotesPageComponent,
    TeamsListPageComponent,
    TeamsViewPageComponent,
    CreateNewDialogComponent,
    UsersListComponent,
    AssetViewComponent,
    SubtypePropertyComponent,
    SubtypeViewComponent,
    SubtypeEditComponent,
    SubtypeDialogComponent,
    BreadcrumbComponent,
    ContributorsPageComponent,
    ContributorEditDialogComponent,
    SearchComponent,
    DescriptiveDiffComponent,
    PropertyDiffComponent,
    CitationDiffComponent,
    OrderedListDiffComponent,
    SubtypeDiffComponent,
    ExternalReferencesDiffComponent,
    BooleanPropertyComponent,
    StatementDiffComponent,
    TlpDiffComponent,
    VersionPopoverComponent,
    DetectionStrategyViewComponent,
    LogSourceViewComponent,
    AnalyticViewComponent,
    StixListPageComponent,
    LogSourceReferencePropertyComponent,
    LogSourceReferenceViewComponent,
    LogSourceReferenceEditComponent,
    LogSourceReferenceDialogComponent,
    LogSourceReferenceDiffComponent,
    StixJsonDialogComponent,
    OutdatedContentWarningComponent,
    StreamProgressComponent,
  ],
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTabsModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDividerModule,
    MatStepperModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    DragDropModule,
    ClipboardModule,
    OverlayModule,
  ],
  bootstrap: [AppComponent],
  imports: [
    MarkdownModule.forRoot({
      loader: HttpClient,
    }),
    LoggerModule.forRoot({
      level: environment.log_level,
      disableConsoleLogging: false,
    }),
    MtxPopoverModule,
    NgxJdenticonModule,
    AutosizeModule,
    BrowserModule,
    AppRoutingModule,
    AppRoutingStixModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatTabsModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDividerModule,
    MatStepperModule,
    MatFormFieldModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatBadgeModule,
    DragDropModule,
    ClipboardModule,
    OverlayModule,
    MatAutocompleteModule,
  ],
  providers: [
    AppConfigService,
    provideAppInitializer(() => {
      const initializerFn = initConfig(inject(AppConfigService));
      return initializerFn();
    }),
    {
      provide: JDENTICON_CONFIG,
      useValue: {
        lightness: {
          color: [0.35, 0.6],
          grayscale: [0.35, 0.6],
        },
        saturation: {
          color: 0.5,
          grayscale: 0.5,
        },
        backColor: '#0000',
      },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
