import { Component, Input, OnInit } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
    selector: 'app-alias-property',
    templateUrl: './alias-property.component.html',
    styleUrls: ['./alias-property.component.scss']
})
export class AliasPropertyComponent implements OnInit {
    @Input() public config: AliasPropertyConfig;

    constructor() {
        // intentionally left blank
    }

    ngOnInit(): void {
        // intentionally left blank
    }
}

export interface AliasPropertyConfig {
    /* What is the current mode? Default: 'view'
     *    view: viewing the alias property
     *    edit: editing the alias property
     *    diff: displaying the diff between two STIX objects. If this mode is selected, two StixObjects must be specified in the objects field
     */
    mode?: "view" | "edit" | "diff";
    /* The object to show the alias of
     * Note: if mode is diff, pass an array of two objects to diff
     */
    object: StixObject | [StixObject, StixObject];
    /* the field of the object(s) to visualize as a alias
     */
    field: string;
    /* referencesField; references field. 
     * References will be removed if not included 
     */
    referencesField?: string;
    /* Default true if omitted. For the view mode, if false, 
    * overflow will be hidden and marked with an ellipses. 
    * A tooltip will provide the full value.
    */
    wrap?: boolean
    /* label; label for labelled box
     * Required when using view mode
     */
    label?: string;
}
