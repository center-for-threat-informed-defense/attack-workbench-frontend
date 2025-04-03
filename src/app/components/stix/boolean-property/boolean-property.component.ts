import { Component, Input } from '@angular/core';
import { StixObject } from 'src/app/classes/stix';

@Component({
  selector: 'app-boolean-property',
  templateUrl: './boolean-property.component.html'
})
export class BooleanPropertyComponent {
  @Input() public config: BooleanPropertyConfig;

  public get object() { return Array.isArray(this.config.object) ? this.config.object[0] : this.config.object; }
  public get current(): string { return this.object?.[this.config.field] || false; }
  public get previous(): string { return this.config.object[1]?.[this.config.field] || false; }
}

export interface BooleanPropertyConfig {
    /* What is the current mode? Default: 'view
     *    view: viewing the list property
     *    edit: editing the list property
     *    diff: displaying the diff between two STIX objects. If this mode is selected, two StixObjects must be specified in the objects field
     */
    mode?: "view" | "edit" | "diff";
    /* The object to show the field of
     * Note: if mode is diff, pass an array of two objects to diff
     */
    object: StixObject | [StixObject, StixObject];
    /* the field of the object(s) to show */
    field: string;
    /* the checkbox label */
    label: string;
}