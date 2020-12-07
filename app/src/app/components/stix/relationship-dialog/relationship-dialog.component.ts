import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Relationship } from 'src/app/classes/stix/relationship';

@Component({
    selector: 'app-relationship-dialog',
    templateUrl: './relationship-dialog.component.html',
    styleUrls: ['./relationship-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class RelationshipDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RelationshipDialogComponent>, @Inject(MAT_DIALOG_DATA) public config: RelationshipDialogConfig) { }
  public sidebarOpened: boolean = false;
  public toggleSidebar() { this.sidebarOpened = !this.sidebarOpened; }

  ngOnInit(): void {
  }

}

export interface RelationshipDialogConfig {
    relationship: Relationship; // relationship to show in the dialog
}
