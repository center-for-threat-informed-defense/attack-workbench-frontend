import { Component, Input } from '@angular/core';
import { StixObject } from 'src/app/classes/stix';
import { AttackType } from 'src/app/utils/types';

@Component({
  selector: 'app-object-ref-property',
  templateUrl: './object-ref-property.component.html',
  standalone: false,
})
export class ObjectRefPropertyComponent {
  @Input() public config: ObjectRefPropertyConfig;
}

export interface ObjectRefPropertyConfig {
  /** What is the current mode? Default: 'view' */
  mode?: 'view' | 'edit' | 'diff';
  /** The object to show the field of */
  object: StixObject | [StixObject, StixObject];
  /** The field of the object */
  field: string;
  /** The label for labelled box on the view/edit pages */
  label?: string;
  /** The attack type of the object references */
  attackType: AttackType;
  /** The object reference field */
  objectRefField: ObjectRefField;
  /** The fields related to the referenced objects */
  relatedFields?: RelatedField[];
}

export interface ObjectRefField {
  /** The ref field (on the object being viewed/edited) to store the referenced object ids */
  field: string;
  /** The label for labelled box on the ObjectRefComponent view/edit dialog */
  label: string;
}

export interface RelatedField {
  /** The field (on the object being viewed/edited) to store the referenced object data */
  field: string;
  /** The label for labelled box for this related field */
  label: string;
  /** The field to access on the referenced object */
  refField: string;
  /** The key to access within the refField, if the refField is a key,value record. */
  key?: string;
}
