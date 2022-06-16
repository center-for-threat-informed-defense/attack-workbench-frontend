import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-delete-dialog',
    templateUrl: './delete-dialog.component.html',
    styleUrls: ['./delete-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DeleteDialogComponent {
    private deleteConfirmation: string = 'DELETE';
    public confirmInput: string;
    public get invalid(): boolean {
        return this.confirmInput != this.deleteConfirmation;
    }

    constructor(@Inject(MAT_DIALOG_DATA) public config: any, public dialogRef: MatDialogRef<DeleteDialogComponent>) { }

    public confirm() {
        this.dialogRef.close(true);
    }
}