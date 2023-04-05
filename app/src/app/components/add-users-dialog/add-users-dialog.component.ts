import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-add-users-dialog',
  templateUrl: './add-users-dialog.component.html',
  styleUrls: ['./add-users-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddUsersDialogComponent implements OnInit {
  public workingUserList:String[] = [];
  constructor(public dialogRef: MatDialogRef<AddUsersDialogComponent>, @Inject(MAT_DIALOG_DATA)  public config: AddUsersDialogConfig) {
    // deep copy array
    this.workingUserList = this.config.selectedUserIds.slice();
  }

  public clearSelections() {
    this.workingUserList = [];
  }

  ngOnInit(): void {/* intentionally left blank */}

}

export interface AddUsersDialogConfig {
  selectedUserIds: string[]; // Stix Object array of selectable objects not in list
  buttonLabel?: string; // optional button label, default "add"
  title?: string; // dialog text
  clearSelection?: boolean; //boolean to add clear selection button
}
