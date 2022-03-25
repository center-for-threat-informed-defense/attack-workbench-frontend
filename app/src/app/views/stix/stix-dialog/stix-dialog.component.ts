import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { ValidationData } from 'src/app/classes/serializable';
import { Relationship } from 'src/app/classes/stix/relationship';
import { Software } from 'src/app/classes/stix/software';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService, stixTypeToClass } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { EditorService } from 'src/app/services/editor/editor.service';
import { SidebarService, tabOption } from 'src/app/services/sidebar/sidebar.service';
import { StixViewConfig } from '../stix-view-page';

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
                public restApiConnectorService: RestApiConnectorService,
                public editorService: EditorService,
                private authenticationService: AuthenticationService) {
        if (this._config.mode && this._config.mode == "edit" && this.authenticationService.canEdit()) this.startEditing();
    }

    public get config(): StixViewConfig {
        let object = Array.isArray(this._config.object) ? this._config.object[0] : this._config.object;
        return {
            mode: this.editing && this.authenticationService.canEdit() ? "edit" : "view",
            object: object,
            showRelationships: object.attackType == "data-component" ? true : false,
            editable: this._config.editable && this.authenticationService.canEdit(),
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
    }

    public editing: boolean = false;
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
        let subscription = object.validate(this.restApiConnectorService).subscribe({
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
        let subscription = object.save(this.restApiConnectorService).subscribe({
            next: (result) => {
                this.editorService.onEditingStopped.emit();
                if (object.attackType == 'relationship') this.updateRelationshipObjects(object as Relationship); // update source/target object versions
                if (this.prevObject) this.revertToPreviousObject();
                else if (object.attackType == 'data-component') { // view data component on save
                    this.validating = false;
                    this.editing = false;
                }
                else this.dialogRef.close(this.dirty);
            },
            complete: () => { subscription.unsubscribe(); }
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
            saves.push(source_obj.save(this.restApiConnectorService));
        }
        if (this.versions.target.minor || this.versions.target.major) {
            // handle target object version update
            let target_obj = this.getObject(object.target_object.stix.type, object.target_object);
            if (this.versions.target.minor) target_obj.version = target_obj.version.nextMinorVersion();
            else target_obj.version = target_obj.version.nextMajorVersion();
            saves.push(target_obj.save(this.restApiConnectorService));
        }
        if (saves.length) {
            console.log(saves)
            var subscription = forkJoin(saves).subscribe({
                complete: () => { if (subscription) subscription.unsubscribe(); }
            });
        }
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

    public deprecateChanged() {
        let object = Array.isArray(this.config.object) ? this.config.object[0] : this.config.object;
        object.deprecated = !object.deprecated;
        let subscription = object.save(this.restApiConnectorService).subscribe({
            complete: () => { subscription.unsubscribe(); }
        })
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

    ngOnInit(): void { }
}