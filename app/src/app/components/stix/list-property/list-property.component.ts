import { Component, Input } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-list-property',
  templateUrl: './list-property.component.html',
  styleUrls: ['./list-property.component.scss']
})
export class ListPropertyComponent {
    @Input() public config: ListPropertyConfig;

    constructor() {
        // intentionally left blank
    }
}

export interface ListPropertyConfig {
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
    /* Edit mode. Default: 'any' */
    editType?: "select" | "stixList" | "any";
    /* If true, the field will be disabled. Default false if omitted. */
    disabled?: boolean;
    /* If true, the field will be required. Default false if omitted. */
    required?: boolean;
    /* the field of the object(s) to visualize as a list */
    field: string;
    /* if specified, label with this string instead of field */
    label?: string;
    /* Default true if omitted. For the view mode, if false, 
     * overflow will be hidden and marked with an ellipses. 
     * A tooltip will provide the full value.
     */
    wrap?: boolean
}