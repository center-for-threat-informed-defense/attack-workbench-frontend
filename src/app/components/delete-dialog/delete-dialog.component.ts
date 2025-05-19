import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class DeleteDialogComponent {
  private deleteConfirmation = 'DELETE';
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public config: any,
    public dialogRef: MatDialogRef<DeleteDialogComponent>
  ) {}

  public confirm() {
    this.dialogRef.close(true);
  }
}
