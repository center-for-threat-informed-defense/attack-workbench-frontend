import { environment } from 'src/environments/environment';
import { LoggerModule } from 'ngx-logger';

// angular imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, inject, provideAppInitializer } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppRoutingStixModule } from './app-routing-stix.module';
import {
  HttpClient,
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AuthInterceptor } from './services/helpers/auth.interceptor';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';

// other library imports
import { MarkdownModule } from 'ngx-markdown';
import { MtxPopoverModule } from '@ng-matero/extensions/popover';
import { NgxJdenticonModule, JDENTICON_CONFIG } from 'ngx-jdenticon';
import { AutosizeModule } from 'ngx-autosize';

// custom components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ResourcesDrawerComponent } from './components/resources-drawer/resources-drawer.component';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SubheadingComponent } from './components/subheading/subheading.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { EmptyListMarkerComponent } from './components/empty-list-marker/empty-list-marker.component';
import { MarkdownViewDialogComponent } from './components/markdown-view-dialog/markdown-view-dialog.component';
import { CollectionImportSummaryComponent } from './components/collection-import-summary/collection-import-summary.component';
import { SaveDialogComponent } from './components/save-dialog/save-dialog.component';
import { AddDialogComponent } from './components/add-dialog/add-dialog.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { HistoryTimelineComponent } from './components/resources-drawer/history-timeline/history-timeline.component';
import { ReferenceSidebarComponent } from './components/resources-drawer/reference-sidebar/reference-sidebar.component';
import { SearchComponent } from './components/resources-drawer/search/search.component';
import { VersionPopoverComponent } from './components/version-popover/version-popover.component';
import { ReferenceEditDialogComponent } from './components/reference-edit-dialog/reference-edit-dialog.component';
import { MultipleChoiceDialogComponent } from './components/multiple-choice-dialog/multiple-choice-dialog.component';
import { ValidationResultsComponent } from './components/validation-results/validation-results.component';
import { AddRelationshipButtonComponent } from './components/add-relationship-button/add-relationship-button.component';
import { CollectionUpdateDialogComponent } from './components/collection-update-dialog/collection-update-dialog.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

// STIX components
import { StixListComponent } from './components/stix/stix-list/stix-list.component';
import { UsersListComponent } from './components/users-list/users-list.component';

import { ExternalReferencesPropertyComponent } from './components/stix/external-references-property/external-references-property.component';
import { ExternalReferencesViewComponent } from './components/stix/external-references-property/external-references-view/external-references-view.component';

import { DescriptivePropertyComponent } from './components/stix/descriptive-property/descriptive-property.component';
import { DescriptiveViewComponent } from './components/stix/descriptive-property/descriptive-view/descriptive-view.component';
import { DescriptiveEditComponent } from './components/stix/descriptive-property/descriptive-edit/descriptive-edit.component';

import { TimestampPropertyComponent } from './components/stix/timestamp-property/timestamp-property.component';
import { TimestampViewComponent } from './components/stix/timestamp-property/timestamp-view/timestamp-view.component';

import { StatementPropertyComponent } from './components/stix/statement-property/statement-property.component';
import { StatementViewComponent } from './components/stix/statement-property/statement-view/statement-view.component';
import { StatementEditComponent } from './components/stix/statement-property/statement-edit/statement-edit.component';

import { TlpPropertyComponent } from './components/stix/tlp-property/tlp-property.component';
import { TlpViewComponent } from './components/stix/tlp-property/tlp-view/tlp-view.component';
import { TlpEditComponent } from './components/stix/tlp-property/tlp-edit/tlp-edit.component';

import { AttackIDPropertyComponent } from './components/stix/attackid-property/attackid-property.component';
import { AttackIDEditComponent } from './components/stix/attackid-property/attackid-edit/attackid-edit.component';
import { AttackIDViewComponent } from './components/stix/attackid-property/attackid-view/attackid-view.component';
import { AttackidDiffComponent } from './components/stix/attackid-property/attackid-diff/attackid-diff.component';

import { StixIDPropertyComponent } from './components/stix/stixid-property/stixid-property.component';

import { ListPropertyComponent } from './components/stix/list-property/list-property.component';
import { ListEditComponent } from './components/stix/list-property/list-edit/list-edit.component';
import { ListViewComponent } from './components/stix/list-property/list-view/list-view.component';
import { ListDiffComponent } from './components/stix/list-property/list-diff/list-diff.component';

import { VersionPropertyComponent } from './components/stix/version-property/version-property.component';
import { VersionEditComponent } from './components/stix/version-property/version-edit/version-edit.component';
import { VersionViewComponent } from './components/stix/version-property/version-view/version-view.component';
import { VersionDiffComponent } from './components/stix/version-property/version-diff/version-diff.component';

import { NamePropertyComponent } from './components/stix/name-property/name-property.component';

import { StringPropertyComponent } from './components/stix/string-property/string-property.component';

import { DatepickerPropertyComponent } from './components/stix/datepicker-property/datepicker-property.component';

import { AliasPropertyComponent } from './components/stix/alias-property/alias-property.component';
import { AliasViewComponent } from './components/stix/alias-property/alias-view/alias-view.component';
import { AliasEditComponent } from './components/stix/alias-property/alias-edit/alias-edit.component';
import { AliasEditDialogComponent } from './components/stix/alias-property/alias-edit/alias-edit-dialog/alias-edit-dialog.component';
import { AliasDiffComponent } from './components/stix/alias-property/alias-diff/alias-diff.component';

import { SubtypePropertyComponent } from './components/stix/subtype-property/subtype-property.component';
import { SubtypeViewComponent } from './components/stix/subtype-property/subtype-view/subtype-view.component';
import { SubtypeEditComponent } from './components/stix/subtype-property/subtype-edit/subtype-edit.component';
import { SubtypeDialogComponent } from './components/stix/subtype-property/subtype-dialog/subtype-dialog.component';

import { OrderedListPropertyComponent } from './components/stix/ordered-list-property/ordered-list-property.component';
import { OrderedListViewComponent } from './components/stix/ordered-list-property/ordered-list-view/ordered-list-view.component';
import { OrderedListEditComponent } from './components/stix/ordered-list-property/ordered-list-edit/ordered-list-edit.component';

import { NotesEditorComponent } from './components/resources-drawer/notes-editor/notes-editor.component';
import { ObjectStatusComponent } from './components/object-status/object-status.component';
import { RecentActivityComponent } from './components/recent-activity/recent-activity.component';
import { IconViewComponent } from './components/icon-view/icon-view.component';
import { IdentityPropertyComponent } from './components/stix/identity-property/identity-property.component';

import { CitationPropertyComponent } from './components/stix/citation-property/citation-property.component';
import { CitationViewComponent } from './components/stix/citation-property/citation-view/citation-view.component';
import { CitationEditComponent } from './components/stix/citation-property/citation-edit/citation-edit.component';

// views
import { HelpPageComponent } from './views/help-page/help-page.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { AdminPageComponent } from './views/admin-page/admin-page.component';
import { OrgSettingsPageComponent } from './views/admin-page/org-settings-page/org-settings-page.component';
import { UserAccountsPageComponent } from './views/admin-page/user-accounts-page/user-accounts-page.component';
import { DefaultMarkingDefinitionsComponent } from './views/admin-page/default-marking-definitions/default-marking-definitions.component';
import { ProfilePageComponent } from './views/profile-page/profile-page.component';
import { ReferenceManagerComponent } from './views/reference-manager/reference-manager.component';

import { StixDialogComponent } from './views/stix/stix-dialog/stix-dialog.component';
import { StixPageComponent } from './views/stix/stix-page/stix-page.component';

import { CollectionManagerComponent } from './views/collection-manager/collection-manager.component';

import { CollectionIndexListComponent } from './views/stix/collection/collection-index/collection-index-list/collection-index-list.component';
import { CollectionIndexViewComponent } from './views/stix/collection/collection-index/collection-index-view/collection-index-view.component';
import { CollectionIndexImportComponent } from './views/stix/collection/collection-index/collection-index-import/collection-index-import.component';

import { CollectionListComponent } from './views/stix/collection/collection-list/collection-list.component';
import { CollectionViewComponent } from './views/stix/collection/collection-view/collection-view.component';
import { CollectionImportComponent } from './views/stix/collection/collection-import/collection-import-workflow/collection-import.component';
import { CollectionImportReviewComponent } from './views/stix/collection/collection-import/collection-import-review/collection-import-review.component';
import { CollectionImportErrorComponent } from './views/stix/collection/collection-import/collection-import-error/collection-import-error.component';

import { GroupViewComponent } from './views/stix/group-view/group-view.component';
import { MatrixViewComponent } from './views/stix/matrix/matrix-view/matrix-view.component';
import { MitigationViewComponent } from './views/stix/mitigation-view/mitigation-view.component';
import { SoftwareViewComponent } from './views/stix/software-view/software-view.component';
import { TacticViewComponent } from './views/stix/tactic-view/tactic-view.component';
import { TechniqueViewComponent } from './views/stix/technique-view/technique-view.component';
import { RelationshipViewComponent } from './views/stix/relationship-view/relationship-view.component';
import { DataSourceViewComponent } from './views/stix/data-source-view/data-source-view.component';
import { DataComponentViewComponent } from './views/stix/data-component-view/data-component-view.component';
import { MarkingDefinitionViewComponent } from './views/stix/marking-definition-view/marking-definition-view.component';
import { CampaignViewComponent } from './views/stix/campaign-view/campaign-view.component';
import { NotesPageComponent } from './views/notes-page/notes-page.component';
import { MatrixSideComponent } from './views/stix/matrix/matrix-side/matrix-side.component';
import { TacticCellComponent } from './components/matrix/tactic-cell/tactic-cell.component';
import { TechniqueCellComponent } from './components/matrix/technique-cell/technique-cell.component';
import { MatrixFlatComponent } from './views/stix/matrix/matrix-flat/matrix-flat.component';
import { AssetViewComponent } from './views/stix/asset-view/asset-view.component';

import { TeamsListPageComponent } from './views/admin-page/teams/teams-list-page/teams-list-page.component';
import { TeamsViewPageComponent } from './views/admin-page/teams/teams-view-page/teams-view-page.component';
import { CreateNewDialogComponent } from './components/create-new-dialog/create-new-dialog.component';

import { ContributorsPageComponent } from './views/contributors-page/contributors-page.component';
import { ContributorEditDialogComponent } from './components/contributor-edit-dialog/contributor-edit-dialog.component';

import { AppConfigService } from './services/config/app-config.service';
import { DescriptiveDiffComponent } from './components/stix/descriptive-property/descriptive-diff/descriptive-diff.component';
import { PropertyDiffComponent } from './components/property-diff/property-diff.component';
import { CitationDiffComponent } from './components/stix/citation-property/citation-diff/citation-diff.component';
import { OrderedListDiffComponent } from './components/stix/ordered-list-property/ordered-list-diff/ordered-list-diff.component';
import { SubtypeDiffComponent } from './components/stix/subtype-property/subtype-diff/subtype-diff.component';
import { ExternalReferencesDiffComponent } from './components/stix/external-references-property/external-references-diff/external-references-diff.component';
import { BooleanPropertyComponent } from './components/stix/boolean-property/boolean-property.component';
import { StatementDiffComponent } from './components/stix/statement-property/statement-diff/statement-diff.component';
import { TlpDiffComponent } from './components/stix/tlp-property/tlp-diff/tlp-diff.component';
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
    AdminPageComponent,
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
    StixListPageComponent,
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
