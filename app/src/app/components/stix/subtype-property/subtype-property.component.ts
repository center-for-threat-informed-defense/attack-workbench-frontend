import { Component, Input } from '@angular/core';
import { StixObject } from 'src/app/classes/stix';

@Component({
	selector: 'app-subtype-property',
	templateUrl: './subtype-property.component.html'
})
export class SubtypePropertyComponent {
	@Input() public config: SubtypePropertyConfig

	constructor() {
		// intentionally left blank
	}

}

export interface SubtypePropertyConfig {
    /* What is the current mode? Default: 'view' */
    mode?: "view" | "edit";
    /* The object to show the field of */
    object: StixObject;
    /* The field of the object to visualize */
    field: string;
    /* The label for labelled box */
    label: string;
    /* The object's references field. References will be removed if not included */
    referencesField?: string;
	/* The fields & types of the subtype property */
	subtypeFields: {
		name: string;
		type: "string" | "select";
		required?: boolean; // default false
		label?: string;
		supportsReferences?: boolean; // whether this field supports references, default false
		key?: boolean; /** The key field, must have at least one */
	}[];
	/* The tooltip for the add button/edit dialog */
	tooltip: string;
}