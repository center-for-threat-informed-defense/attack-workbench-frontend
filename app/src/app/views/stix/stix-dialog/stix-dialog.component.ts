
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { SidebarService, tabOption } from 'src/app/services/sidebar/sidebar.service';
import { StixViewConfig } from '../stix-view-page';

@Component({
  selector: 'app-stix-dialog',
  templateUrl: './stix-dialog.component.html',
  styleUrls: ['./stix-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StixDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<StixDialogComponent>, @Inject(MAT_DIALOG_DATA) public _config: StixViewConfig, public sidebarService: SidebarService) { }
    public get config(): StixViewConfig {
        return {
            mode: this._config.mode,
            object: this._config.object,
            showRelationships: false,
            editable: this._config.editable,
            sidebarControl: this._config.sidebarControl == "disable"? "disable" : "events"
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
        return Array.isArray(this.config.object)? this.config.object[0].type : (this.config.object as StixObject).type;
    }
  
    ngOnInit(): void {}
}