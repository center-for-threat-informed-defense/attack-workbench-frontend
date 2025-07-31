import { Component, Input } from '@angular/core';
import { StixObject } from 'src/app/classes/stix';

@Component({
  selector: 'app-subtype-property',
  templateUrl: './subtype-property.component.html',
  standalone: false,
})
export class SubtypePropertyComponent {
  @Input() public config: SubtypePropertyConfig;
}

export interface SubtypePropertyConfig {
  /* What is the current mode? Default: 'view' */
  mode?: 'view' | 'edit' | 'diff';
  /* The object to show the field of */
  object: StixObject | [StixObject, StixObject];
  /* The field of the object to visualize */
  field: string;
  /* The label for labelled box */
  label: string;
  /* The object's references field. References will be removed if not included */
  referencesField?: string;
  /* The fields & types of the subtype property */
  subtypeFields: SubtypeField[];
  /* The tooltip for the add button/edit dialog */
  tooltip: string;
}

interface SubtypeField {
  name: string;
  editType: 'string' | 'description' | 'select';
  required?: boolean; // default false
  label?: string; // default name
  supportsReferences?: boolean; // whether this field supports references, default false
  key?: boolean; // the key field, must have at least one
}
