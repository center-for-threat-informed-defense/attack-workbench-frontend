import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StixObject } from 'src/app/classes/stix';

@Component({
  selector: 'app-stix-json-dialog',
  templateUrl: './stix-json-dialog.component.html',
  styleUrl: './stix-json-dialog.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class StixJsonDialogComponent {
  public formattedJson: string;
  public title: string;
  public subtitle: string;

  constructor(
    public dialogRef: MatDialogRef<StixJsonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public snackbar: MatSnackBar
  ) {
    const stixObject: StixObject = data.stixObject;
    this.title = stixObject['name'] ? stixObject['name'] : 'Raw STIX JSON';
    this.subtitle = stixObject.attackID ? stixObject.attackID : '';
    this.formattedJson = JSON.stringify(stixObject.serialize(), null, 4);
  }
}
