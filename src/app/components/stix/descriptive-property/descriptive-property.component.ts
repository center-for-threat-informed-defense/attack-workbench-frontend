import { Component, OnInit, Input } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-descriptive-property',
  templateUrl: './descriptive-property.component.html',
  styleUrls: ['./descriptive-property.component.scss'],
  standalone: false,
})
export class DescriptivePropertyComponent implements OnInit {
  @Input() public config: DescriptivePropertyConfig;

  constructor() {
    // intentionally left blank
  }

  ngOnInit(): void {
    // intentionally left blank
  }
}

export interface DescriptivePropertyConfig {
  /* What is the current mode? Default: 'view'
   *    view: viewing the descriptive property
   *    edit: editing the descriptive property
   *    diff: displaying the diff between two STIX objects. If this mode is selected, two StixObjects must be specified in the objects field
   */
  mode?: 'view' | 'edit' | 'diff';
  /* The object to show the descriptive field of
   * Note: if mode is diff, pass an array of two objects to diff
   */
  object: StixObject | [StixObject, StixObject];
  /** field; field of object to be displayed */
  field: string;
  /** firstParagraphOnly; force descriptive field to show first paragraph only */
  firstParagraphOnly?: boolean;
  /** referencesField; external references field */
  referencesField?: string;
  /* label; label for labelled box
   * Required when using view mode
   */
  label?: string;
  /* parseReferences; whether or not any references will be parsed
   * optional: defaults to true
   */
  parseReferences?: boolean;
}
