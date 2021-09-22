import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidationData } from 'src/app/classes/serializable';
import { StixObject } from 'src/app/classes/stix/stix-object';
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

    constructor(public dialogRef: MatDialogRef<StixDialogComponent>, @Inject(MAT_DIALOG_DATA) public _config: StixViewConfig, public sidebarService: SidebarService, public restApiConnectorService: RestApiConnectorService, public editorService: EditorService) {
        if (this._config.mode && this._config.mode == "edit") this.startEditing();
    }
    public get config(): StixViewConfig {
        let object = Array.isArray(this._config.object)? this._config.object[0] : this._config.object;
        return {
            mode: this.editing? "edit" : "view",
            object: object,
            showRelationships: object.attackType == "data-component" ? true : false,
            editable: this._config.editable,
            sidebarControl: this._config.sidebarControl == "disable"? "disable" : "events"
        }
    }

    public prevObject;
    public openObject(object: StixObject): void {
        this.prevObject = this._config.object;
        this._config.object = object;
    }
    public goBack(): void {
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
        let object = Array.isArray(this.config.object)? this.config.object[0] : this.config.object;
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
        let object = Array.isArray(this.config.object)? this.config.object[0] : this.config.object;
        let subscription = object.save(this.restApiConnectorService).subscribe({
            next: (result) => { 
                this.dialogRef.close(this.dirty);
                this.editorService.onEditingStopped.emit();
            },
            complete: () => { subscription.unsubscribe(); }
        })
    }
    public cancelValidation() {
        this.validating = false;
    }

    public close() {
        this.dialogRef.close(this.dirty);
    }

    public deprecateChanged() {
        let object = Array.isArray(this.config.object)? this.config.object[0] : this.config.object;
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
        return Array.isArray(this.config.object)? this.config.object[0].type : (this.config.object as StixObject).type;
    }
    public get isDeprecated(): boolean {
        return Array.isArray(this.config.object)? this.config.object[0].deprecated : (this.config.object as StixObject).deprecated;
    }
  
    ngOnInit(): void {}
}