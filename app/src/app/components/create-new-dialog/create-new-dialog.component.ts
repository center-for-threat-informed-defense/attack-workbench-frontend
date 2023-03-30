import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-new-dialog',
  templateUrl: './create-new-dialog.component.html',
  styleUrls: ['./create-new-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateNewDialogComponent {
  private config:CreateNewDialogConfig;
  objectType = 'object_type_unknown';
  formObjects = [];
  newObject = {};

  public get invalid(): boolean {
    for (let i = 0; i < this.formObjects.length; i++) {
      const formObject = this.formObjects[i];
      if (formObject.required) {
        if (!this.newObject[formObject.name]) {
          return true;
        }
      }
    }
    return false;
}

  constructor(@Inject(MAT_DIALOG_DATA) public matDialogConfig: any, public dialogRef: MatDialogRef<CreateNewDialogComponent>) { 
    this.config = this.matDialogConfig.config;
    this.objectType = this.config.objectName;
    this.formObjects = this.config.formObjects;
  }

  public confirm() {
    this.dialogRef.close({createObject: true, newObject: this.newObject});
  }
}

export interface CreateNewDialogConfig {
  objectName: string;
  formObjects: CreateNewDialogFormObject[];
}

type supported_form_input_types = 'text' | 'textBox';
export interface CreateNewDialogFormObject {
  name: string;
  type: supported_form_input_types;
  required: boolean;
}
