import { Component, Input, OnInit } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-list-property',
  templateUrl: './list-property.component.html',
  styleUrls: ['./list-property.component.scss']
})
export class ListPropertyComponent implements OnInit {
    @Input() public config: ListPropertyConfig;

    constructor() { }

    ngOnInit(): void {
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