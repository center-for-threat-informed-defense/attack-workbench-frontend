import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

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

    constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>) { }

    public confirm() {
        this.dialogRef.close(true);
    }
}