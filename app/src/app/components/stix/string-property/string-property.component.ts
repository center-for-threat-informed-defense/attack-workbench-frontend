import { Component, Input, ViewEncapsulation } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
    selector: 'app-string-property',
    templateUrl: './string-property.component.html',
    styleUrls: ['./string-property.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StringPropertyComponent {
    @Input() public config: StringPropertyConfig;

    public get current() { return this.config.object[0]?.[this.config.field] || ''; }
    public get previous() { return this.config.object[1]?.[this.config.field] || ''; }

    constructor() {
        // intentionally left blank
    }
}

export interface StringPropertyConfig {
    /* What is the current mode? Default: 'view
     *    view: viewing the property
     *    edit: editing the property
     *    diff: displaying the diff between two STIX objects. If this mode is selected, two StixObjects must be specified in the objects field
     */
    mode?: "view" | "edit" | "diff";
    /* The object to show the field of
     * Note: if mode is diff, pass an array of two objects to diff
     */
    object: StixObject | [StixObject, StixObject];
    /* the field of the object(s) */
    field: string;
    /* if specified, label with this string instead of field */
    label?: string;
    /* If true, the field will be required. Default false if omitted. */
    required?: boolean;
}