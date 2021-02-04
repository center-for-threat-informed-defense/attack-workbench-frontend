import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VersionNumber } from 'src/app/classes/version-number';

@Component({
  selector: 'app-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaveDialogComponent implements OnInit {

    public currentVersion: string;
    public nextMajorVersion: string;
    public nextMinorVersion: string;

    constructor(public dialogRef: MatDialogRef<SaveDialogComponent>, @Inject(MAT_DIALOG_DATA) public version: VersionNumber) {
        this.currentVersion = version.toString();
        this.nextMajorVersion = version.nextMajorVersion().toString();
        this.nextMinorVersion = version.nextMinorVersion().toString();
    }

    ngOnInit(): void {
    }

}
