import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
	selector: 'app-create-new-dialog',
	templateUrl: './create-new-dialog.component.html',
	styleUrls: ['./create-new-dialog.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class CreateNewDialogComponent {
	private config: CreateNewDialogConfig;
	objectType = 'object_type_unknown';
	formObjects = [];
	newObject = {};

	/**
	 * Checks if the form has any components that need to be filled out
	 */
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

	/**
	 * Sends back the confirm with all properties
	 */
	public confirm() {
		this.dialogRef.close({ createObject: true, newObject: this.newObject });
	}
}

export interface CreateNewDialogConfig {
	// name of the object
	objectName: string;
	// list of all properties that need to be filled out
	formObjects: CreateNewDialogFormObject[];
}

type supported_form_input_types = 'text' | 'textBox';
export interface CreateNewDialogFormObject {
	// name of the property
	name: string;
	// form type to display
	type: supported_form_input_types;
	// whether or not the property is required
	required: boolean;
}
