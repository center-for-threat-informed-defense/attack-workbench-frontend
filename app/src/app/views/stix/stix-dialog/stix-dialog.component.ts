import { Component, EventEmitter, Inject, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { ValidationData } from 'src/app/classes/serializable';
import { Asset, Campaign, DataComponent, DataSource, Group, Identity, MarkingDefinition, Matrix, Mitigation, Relationship, Software, StixObject, Tactic, Technique } from 'src/app/classes/stix';
import { Collection } from 'src/app/classes/stix/collection';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { DeleteDialogComponent } from 'src/app/components/delete-dialog/delete-dialog.component';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { EditorService } from 'src/app/services/editor/editor.service';
import { SidebarService, tabOption } from 'src/app/services/sidebar/sidebar.service';
import { StixViewConfig } from '../stix-view-page';

// transform AttackType to the relevant class
const stixTypeToClass = {
    "attack-pattern": Technique,
    "x-mitre-tactic": Tactic,
    "campaign": Campaign,
    "intrusion-set": Group,
    "tool": Software,
    "malware": Software,
    "course-of-action": Mitigation,
    "x-mitre-matrix": Matrix,
    "x-mitre-collection": Collection,
    "relationship": Relationship,
    "identity": Identity,
    "marking-definition": MarkingDefinition,
    "x-mitre-data-source": DataSource,
    "x-mitre-data-component": DataComponent,
    "x-mitre-asset": Asset,
}

@Component({
    selector: 'app-stix-dialog',
    templateUrl: './stix-dialog.component.html',
    styleUrls: ['./stix-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class StixDialogComponent implements OnInit {
    constructor(public dialogRef: MatDialogRef<StixDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public _config: StixViewConfig,
                public sidebarService: SidebarService,
                public restApiService: RestApiConnectorService,
                public editorService: EditorService,
                private authenticationService: AuthenticationService,
                private dialog: MatDialog) {
        if (this._config.mode && this._config.mode == "edit" && this.authenticationService.canEdit()) this.startEditing();
    }

    public get canDelete(): boolean { return this.authenticationService.canDelete(); }

    public get canDeprecate(): boolean { return this.stixType == 'relationship' || this.stixType == 'x-mitre-data-component'; }

    public get config(): StixViewConfig {
        let object = Array.isArray(this._config.object) ? this._config.object[0] : this._config.object;
        return {
            mode: this.editing && this.authenticationService.canEdit() ? "edit" : "view",
            object: object,
            sourceType: this._config.sourceType ? this._config.sourceType : null,
            targetType: this._config.targetType ? this._config.targetType : null,
            showRelationships: object.attackType == "data-component" ? true : false,
            editable: this._config.editable && this.authenticationService.canEdit(),
            is_new: this._config.is_new ? true : false,
            sidebarControl: this._config.sidebarControl == "disable" ? "disable" : "events",
            dialog: this.dialogRef // relevant when adding a new relationship inside of an existing dialog
        }
    }

    public prevObject;
    /**
     * Store the current object being viewed in the dialog and 
     * replace the content with the given object. Only a single
     * previous object can be stored and returned to at a time.
     * @param object the new object to display in the dialog
     */
    public changeDialogObject(object: StixObject): void {
        this.prevObject = this._config.object;
        this._config.object = object;
        this.reload();
    }

    /**
     * View the previously stored object in the dialog, which
     * is set in changeDialogObject(). This will stop any validation
     * or editing on the current object.
     */
    public revertToPreviousObject(): void {
        this.validating = false;
        this.editing = false;
        this._config.object = this.prevObject;
        this.prevObject = undefined;
        this.reload();
    }

    public editing: boolean = false;
    public deletable: boolean = false;
    public validating: boolean = false;
    public validation: ValidationData = null;
    public dirty: boolean = false;
    public startEditing() {
        this.dialogRef.disableClose = true;
        this.editing = true;
        this.dirty = true;
    }
    public validate() {
        this.sidebarOpened = false;
        this.validation = null; // reset prior validation if it has been loaded
        this.validating = true;
        let object = Array.isArray(this.config.object) ? this.config.object[0] : this.config.object;
        let subscription = object.validate(this.restApiService).subscribe({
            next: (result) => {
                this.validation = result;
            },
            complete: () => { subscription.unsubscribe(); }
        })
    }
    public get saveEnabled() {
        return this.validation && this.validation.errors.length == 0;
    }

    public save() {
        let object = Array.isArray(this.config.object) ? this.config.object[0] : this.config.object;
        let subscription = object.save(this.restApiService).subscribe({
            next: (result) => {
                this.editorService.onEditingStopped.emit();
                this._config.is_new = false;
                if (object.attackType == 'relationship' && object instanceof Relationship)
                {
                    this.updateRelationshipObjects(object as Relationship); // update source/target object versions
                    let source_object = this.getObject(object.source_object.stix.type, object.source_object);
                    this.updateSourceObject(this.restApiService, source_object)
                }
                if (this.prevObject) this.revertToPreviousObject();
                else if (object.attackType == 'data-component') { // view data component on save
                    this.validating = false;
                    this.editing = false;
                }
                else this.dialogRef.close(this.dirty);
            },
            complete: () => {
                this.reload();
                subscription.unsubscribe();
            }
        })
    }
    public cancelValidation() {
        this.validating = false;
    }

    public discardChanges() {
        this.editorService.onEditingStopped.emit();
        if (this.prevObject) this.revertToPreviousObject();
        else this.close();
    }

    /** 
     * Determine whether or not this object can be deleted
     */
    public getDeletable(): Observable<boolean> {
        let object = Array.isArray(this.config.object) ? this.config.object[0] : this.config.object;
        if (this.stixType == 'relationship') {
            // 'subtechnique_of' relationships cannot be deleted
            return of(this.stixType == 'relationship' && (object as Relationship).relationship_type != 'subtechnique_of');
        }
        if (this.stixType == 'x-mitre-data-component') {
            // cannot delete a data component if it has existing relationships
            return this.restApiService.getRelatedTo({sourceOrTargetRef: (object as DataComponent).stixID}).pipe(
                map(relationships => {
                    return relationships.data.length == 0
                })
            )
        }
        return of(false);
    }

    /**
     * Opens the deletion confirmation dialog and deletes the object
     */
    public delete(): void {
        let object = (Array.isArray(this.config.object) ? this.config.object[0] : this.config.object) as Relationship;

        // open confirmation dialog
        let prompt = this.dialog.open(DeleteDialogComponent, {
            maxWidth: "35em",
            disableClose: true,
            autoFocus: false // disables auto focus on the dialog form field
        });
        let subscription = prompt.afterClosed().subscribe({
            next: (confirm) => {
                if (confirm) {
                    // delete the object
                    object.delete(this.restApiService);
                    if (object.attackType == 'relationship' && object instanceof Relationship)
                    {
                        let source_object = this.getObject(object.source_object.stix.type, object.source_object);
                        this.updateSourceObject(this.restApiService, source_object)
                    }
                    this.discardChanges();
                }
            },
            complete: () => { subscription.unsubscribe(); } //prevent memory leaks
        });
    }

    public close() {
        if (this.prevObject) this.prevObject = undefined; // unset previous object
        this.dialogRef.close(this.dirty);
    }

    // track version updates for relationship source/target objects
    private versions: any = {
        source: {},
        target: {}
    }

    /**
     * Handle version checkbox change on relationship view dialog
     * @param {any} $event version update status
     */
    public versionChange($event: any): void {
        if ($event.source) this.versions.source = $event.source;
        if ($event.target) this.versions.target = $event.target;
    }

    /**
     * Update and save new versions of a relationships source and/or target object,
     * @param {Relationship} object the relationship object
     */
    public updateRelationshipObjects(object: Relationship): void {
        let saves = [];
        if (this.versions.source.minor || this.versions.source.major) {
            // handle source object version update
            let source_obj = this.getObject(object.source_object.stix.type, object.source_object);
            if (this.versions.source.minor) source_obj.version = source_obj.version.nextMinorVersion();
            else source_obj.version = source_obj.version.nextMajorVersion();
            saves.push(source_obj.save(this.restApiService));
        }
        if (this.versions.target.minor || this.versions.target.major) {
            // handle target object version update
            let target_obj = this.getObject(object.target_object.stix.type, object.target_object);
            if (this.versions.target.minor) target_obj.version = target_obj.version.nextMinorVersion();
            else target_obj.version = target_obj.version.nextMajorVersion();
            saves.push(target_obj.save(this.restApiService));
        }
        if (saves.length) {
            var subscription = forkJoin(saves).subscribe({
                complete: () => { if (subscription) subscription.unsubscribe(); }
            });
        }
    }

    /**
     * Helper function to update the workflow status of the source object of the relationship,
     * @param restAPIService the rest api service
     * @param object the relationship source object
     */
    public updateSourceObject(restAPIService: RestApiConnectorService, object: StixObject) {
        object.workflow = {state: "work-in-progress"};
        restAPIService.relationshipPosted = true
        object.update(restAPIService).subscribe({
            next: (response) => {
                console.log('Object updated successfully:', response);
                window.location.reload();
            },
            error: (error) => {
                console.error('Error updating object:', error);
            },
            complete: () => {
                console.log('Complete');
            }
        });
    }


    /**
     * Creates and returns the deserialized object
     * @param type the stix type of the object
     * @param raw the raw STIX object
     */
    private getObject(type: string, raw: any) {
        if (type == "malware" || type == "tool") return new Software(type, raw);
        return new stixTypeToClass[type](raw);
    }

    public loading: boolean = false;
    public deprecateChanged() {
        let object = Array.isArray(this.config.object) ? this.config.object[0] : this.config.object;

        if (!object.deprecated && this.stixType == 'x-mitre-data-component') {
            // inform users of relationship changes
            let confirmationPrompt = this.dialog.open(ConfirmationDialogComponent, {
                maxWidth: "35em",
                data: { 
                    message: 'All relationships with this object will be deprecated. Do you want to continue?',
                },
				autoFocus: false, // prevents auto focus on buttons
            });

            let confirmationSub = confirmationPrompt.afterClosed().pipe(
                filter((result) => result), // user continued
                switchMap(_ => {
                    this.loading = true;
                    return this.restApiService.getRelatedTo({sourceRef: object.stixID, includeDeprecated: false});
                })
            ).subscribe({
                next: (result) => {
                    let saves = [];
                    let relationships = result?.data as Relationship[];

                    // deprecate or revoke object
                    object.deprecated = !object.deprecated;
                    this.dirty = true; // triggers refresh of object list
                    saves.push(object.save(this.restApiService));
            
                    // update relationships with the object
                    for (let relationship of relationships) {
                        relationship.deprecated = true;
                        saves.push(relationship.save(this.restApiService));
                    }

                    // complete save calls
                    let saveSubscription = forkJoin(saves).subscribe({
                        complete: () => {
                            this.editorService.onReload.emit();
                            saveSubscription.unsubscribe();
                        }
                    });               
                },
                complete: () => {
                    this.loading = false;
                    confirmationSub.unsubscribe();
                }
            });
        } else {
            object.deprecated = !object.deprecated;
            this.dirty = true; // triggers refresh of object list

            // save object
            let subscription = object.save(this.restApiService).subscribe({
                complete: () => { subscription.unsubscribe(); }
            })
        }
    }

    public sidebarOpened: boolean = false;
    public currentTab: tabOption = "history";
    public toggleSidebar() { this.sidebarOpened = !this.sidebarOpened; }
    public openHistory() {
        this.sidebarOpened = true;
        this.currentTab = "history";
    }
    public openNotes() {
        this.sidebarOpened = true;
        this.currentTab = "notes";
    }
    public get stixType(): string {
        return Array.isArray(this.config.object) ? this.config.object[0].type : (this.config.object as StixObject).type;
    }
    public get isDeprecated(): boolean {
        return Array.isArray(this.config.object) ? this.config.object[0].deprecated : (this.config.object as StixObject).deprecated;
    }

    public reload() {
        this.getDeletable().subscribe(res => this.deletable = res);
    }

    ngOnInit(): void {
        this.reload();
    }
}