import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class AddDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public config: AddDialogConfig
  ) {}

  public clearSelections() {
    this.config.select.clear();
    this.dialogRef.close(true);
  }

  ngOnInit(): void {
    // intentionally left blank
  }
}

export interface AddDialogConfig {
  selectableObjects: StixObject[]; // Stix Object array of selectable objects not in list
  type: string; // type to display stix list
  select: SelectionModel<string>; // selection model to retrieve list of selected object
  selectionType?: string; // 'many', 'one', or 'disabled'; defaults to 'many' if a selection model is given
  buttonLabel?: string; // optional button label, default "add"
  title?: string; // dialog text
  clearSelection?: boolean; //boolean to add clear selection button
}
