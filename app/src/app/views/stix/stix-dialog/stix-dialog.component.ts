import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidationData } from 'src/app/classes/serializable';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { SidebarService, tabOption } from 'src/app/services/sidebar/sidebar.service';
import { StixViewConfig } from '../stix-view-page';

@Component({
  selector: 'app-stix-dialog',
  templateUrl: './stix-dialog.component.html',
  styleUrls: ['./stix-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StixDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<StixDialogComponent>, @Inject(MAT_DIALOG_DATA) public _config: StixViewConfig, public sidebarService: SidebarService, public restApiConnectorService: RestApiConnectorService) { }
    public get config(): StixViewConfig {
        return {
            mode: this.editing? "edit" : "view",
            object: this._config.object,
            showRelationships: false,
            editable: this._config.editable,
            sidebarControl: this._config.sidebarControl == "disable"? "disable" : "events"
        }
    }

    public editing: boolean = false;
    public validating: boolean = false;
    public validation: ValidationData = null;
    public startEditing() {
        this.dialogRef.disableClose = true;
        this.editing = true;
    }
    public validate() {
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
        let subscription = object.save(true, this.restApiConnectorService).subscribe({
            next: (result) => { 
                this.dialogRef.close(true);
            },
            complete: () => { subscription.unsubscribe(); }
        })
    }
    public cancelValidation() {
        this.validating = false;
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
  
    ngOnInit(): void {}
}