import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-add-users-dialog',
  templateUrl: './add-users-dialog.component.html',
  styleUrls: ['./add-users-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddUsersDialogComponent implements OnInit {
  public selection:SelectionModel<String>;
  constructor(public dialogRef: MatDialogRef<AddUsersDialogComponent>, @Inject(MAT_DIALOG_DATA)  public config: AddUsersDialogConfig) {
    this.selection = this.config.selection ? this.config.selection : new SelectionModel<String>(true);
    for (let i = 0; i < this.config.selectedUserIds.length; i++) {
      this.selection.toggle(this.config.selectedUserIds[i]);
    }
  }

  public clearSelections() {
    this.selection.clear();
  }

  ngOnInit(): void {/* intentionally left blank */}

}

export interface AddUsersDialogConfig {
  selectedUserIds: string[]; // Stix Object array of selectable objects not in list
  buttonLabel?: string; // optional button label, default "add"
  title?: string; // dialog text
  clearSelection?: boolean; //boolean to add clear selection button
  selection: SelectionModel<String>,
}
