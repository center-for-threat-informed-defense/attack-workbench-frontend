import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
	public value: any = {};

    public allowedValues: any = {};
    public dataLoaded: boolean = false;
    private allowedValuesSub: Subscription = new Subscription();
	private saveSubscription: Subscription = new Subscription();

    // map for fields with allowed values
    public fieldToStix = {
        "related_asset_sector": "x_mitre_sectors"
    }

	public get isValid(): boolean {
		let required = this.config.subtypeFields.filter(field => field.required);
		return required.every(field => field.name in this.value && this.value[field.name].length)
	}

	constructor(public dialogRef: MatDialogRef<SubtypeDialogComponent>,
				@Inject(MAT_DIALOG_DATA) public config: SubtypeDialogConfig,
				public restApiService: RestApiConnectorService,
				public editorService: EditorService) {
		this.isNew = config.index == undefined ? true : false;
		if (!this.isNew) this.value = config.object[config.field][config.index];
	}

	ngOnInit(): void {
		// load allowed values for 'select' fields
		let selections = this.config.subtypeFields.filter(field => field.type == 'select').map(field => field.name);
		if (selections.length) {
			this.allowedValuesSub = this.restApiService.getAllAllowedValues().subscribe({
				next: (data) => {
					let attackType = this.config.object.attackType;
					let allAllowedValues = data.find(obj => obj.objectType == attackType);
					selections.forEach(field => {
						let values: Set<string> = new Set();
						let property = allAllowedValues.properties.find(p => p.propertyName == this.fieldToStix[field]);
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
			})
		}
	}

	ngOnDestroy(): void {
		if (this.allowedValuesSub) this.allowedValuesSub.unsubscribe();
		if (this.saveSubscription) this.saveSubscription.unsubscribe();
	}

	public saveValue(): void {
		if (this.config.index || this.config.index === 0) {
			// update the existing value
			this.config.object[this.config.field][this.config.index] = this.value;
		} else {
			// add the value to the field
			this.config.object[this.config.field].push(this.value);
		}

		// parse citations
		this.saveSubscription = this.config.object['external_references'].parseObjectCitations(this.config.object, this.restApiService).subscribe({
			next: (result) => {
				this.editorService.onReloadReferences.emit();
			}
		})
		this.dialogRef.close();
	}
}

export interface SubtypeDialogConfig {
	object: StixObject;
	field: string;
	index?: number;
	tooltip: string;
	subtypeFields: {
		name: string;
		type: string;
		label: string;
		required?: boolean;
		key?: boolean; /** The key field, must have at least one */
	}[];
}