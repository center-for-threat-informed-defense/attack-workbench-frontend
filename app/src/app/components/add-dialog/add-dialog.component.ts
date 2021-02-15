import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddDialogComponent>, @Inject(MAT_DIALOG_DATA)  public config: AddDialogConfig) {}

  ngOnInit(): void {
    console.log(this.config.globalObjects);
  }

}

export interface AddDialogConfig {
  globalObjects: StixObject[]; //Stix Object array
  field: string; // field for stix objects
}
