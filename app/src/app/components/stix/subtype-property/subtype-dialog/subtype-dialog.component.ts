import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatLegacyOptionSelectionChange as MatOptionSelectionChange } from '@angular/material/legacy-core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { StixObject } from 'src/app/classes/stix';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { EditorService } from 'src/app/services/editor/editor.service';

@Component({
	selector: 'app-subtype-dialog',
	templateUrl: './subtype-dialog.component.html',
	styleUrls: ['./subtype-dialog.component.scss']
})
export class SubtypeDialogComponent implements OnInit, OnDestroy {
	public isNew: boolean = false;
	public data: any = {};

    public allowedValues: any = {};
	public selectControls: {[index: string] : FormControl} = {} ;
    public dataLoaded: boolean = false;
    private allowedValuesSub: Subscription = new Subscription();
	private saveSubscription: Subscription = new Subscription();

	public get isValid(): boolean {
		let required = this.config.subtypeFields.filter(field => field.required);
		return required.every(field => field.name in this.data && this.data[field.name].length)
	}

	constructor(public dialogRef: MatDialogRef<SubtypeDialogComponent>,
				@Inject(MAT_DIALOG_DATA) public config: SubtypeDialogConfig,
				public restApiService: RestApiConnectorService,
				public editorService: EditorService) {
		this.isNew = config.index == undefined;
		if (!this.isNew) this.data = config.object[config.field][config.index];
	}

	ngOnInit(): void {
		// retrieve 'select' fields
		let selections = this.config.subtypeFields.filter(field => field.editType == 'select').map(field => field.name);
		if (!selections.length) return;

		// create a form control for each 'select' field
		selections.forEach(fieldName => {
			if (!this.data[fieldName]) this.data[fieldName] = [];
			this.selectControls[fieldName] = new FormControl(this.data[fieldName]);
		});

		// load allowed values for 'select' fields
		this.allowedValuesSub = this.restApiService.getAllAllowedValues().subscribe({
			next: (data) => {
				let allAllowedValues = data.find(obj => obj.objectType == this.config.object.attackType);
				selections.forEach(field => {
					let values: Set<string> = new Set();
					let property = allAllowedValues.properties.find(p => p.propertyName == field);
					if ("domains" in this.config.object) {
						let obj = this.config.object as any;
						property.domains.forEach(domain => {
							if (obj.domains.includes(domain.domainName)) {
								domain.allowedValues.forEach(values.add, values);
							}
						})
					} else { // domains not specified on object
						property.domains.forEach(domain => {
							domain.allowedValues.forEach(values.add, values);
						});
					}
					this.allowedValues[field] = Array.from(values);
				});
				this.dataLoaded = true;
			}
		});
	}

	ngOnDestroy(): void {
		if (this.allowedValuesSub) this.allowedValuesSub.unsubscribe();
		if (this.saveSubscription) this.saveSubscription.unsubscribe();
	}

	/** Add value to subtype field */
	public add(): void {
		if (this.config.index || this.config.index === 0) {
			// update the existing value
			this.config.object[this.config.field][this.config.index] = this.data;
		} else {
			// add the value to the field
			this.config.object[this.config.field].push(this.data);
		}

		// parse citations
		this.saveSubscription = this.config.object['external_references'].parseObjectCitations(this.config.object, this.restApiService).subscribe({
			next: (result) => {
				this.editorService.onReloadReferences.emit();
			}
		})
		this.dialogRef.close();
	}

	/** Handles onSelectionChange event to add or remove the
	 *  user's selection from a multi-select field */
	public change(event: MatOptionSelectionChange, fieldName: string): void {
		if (!event.isUserInput) return;
		if (event.source.selected) this.data[fieldName].push(event.source.value);
		else this.remove(fieldName, event.source.value);
	}

	/** Remove value from multi-select field */
	public remove(fieldName: string, value: string): void {
		let values = this.selectControls[fieldName].value as string[];
		let i = values.indexOf(value);
		if (i >= 0) values.splice(i, 1);
		this.selectControls[fieldName].setValue(values);
	}
}

export interface SubtypeDialogConfig {
	object: StixObject;
	field: string;
	index?: number;
	tooltip: string;
	subtypeFields: {
		name: string;
		editType: string;
		label: string;
		required?: boolean;
		key?: boolean; /** Specifies which subtypeField is used as an indexing key, there must be at least one */
	}[];
}