import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
    selector: 'app-delete-dialog',
    templateUrl: './delete-dialog.component.html',
    styleUrls: ['./delete-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DeleteDialogComponent {
    private deleteConfirmation: string = 'DELETE';
    public confirmInput: string;
    public get hardDelete(): boolean {
        return this.config && this.config.hardDelete;
    }
    public get invalid(): boolean {
        return this.confirmInput != this.deleteConfirmation;
    }
    public get collectionDelete(): boolean {
      return this.config && this.config.collectionDelete;
  }

    constructor(@Inject(MAT_DIALOG_DATA) public config: any, public dialogRef: MatDialogRef<DeleteDialogComponent>) { }

    public confirm() {
        this.dialogRef.close(true);
    }
}