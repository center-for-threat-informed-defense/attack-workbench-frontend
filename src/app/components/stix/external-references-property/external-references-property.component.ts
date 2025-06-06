import { Component, Input } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-external-references-property',
  templateUrl: './external-references-property.component.html',
  styleUrls: ['./external-references-property.component.scss'],
  standalone: false,
})
export class ExternalReferencesPropertyComponent {
  @Input() public config: ExternalReferencesPropertyConfig;
}

export interface ExternalReferencesPropertyConfig {
  /* What is the current mode? Default: 'view
   *    view: viewing the descriptive property
   *    edit: editing the descriptive property
   *    diff: displaying the diff between two STIX objects. If this mode is selected, two StixObjects must be specified in the objects field
   */
  mode: 'view' | 'edit' | 'diff';
  /* The object to show the descriptive field of
   * Note: if mode is diff, pass an array of two objects to diff
   */
  object: StixObject | [StixObject, StixObject];
  /** referencesField; external references field */
  referencesField: string;
}
