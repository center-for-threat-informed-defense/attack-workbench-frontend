import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidationData } from 'src/app/classes/serializable';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
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