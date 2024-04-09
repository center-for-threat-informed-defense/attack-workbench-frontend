import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public config: ConfirmationDialogConfig) { }

    ngOnInit(): void {
        // intentionally left blank
    }

}

export interface ConfirmationDialogConfig {
    message: string; //prompt text
    yes_suffix?: string; //optional suffix to add to the yes button
    no_suffix?: string; //optional suffix to add to the no button
}
