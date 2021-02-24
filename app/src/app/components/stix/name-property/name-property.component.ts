import { Component, Input, OnInit } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-name-property',
  templateUrl: './name-property.component.html',
  styleUrls: ['./name-property.component.scss']
})
export class NamePropertyComponent implements OnInit {
    @Input() public config: NamePropertyConfig;

    constructor() { }

    ngOnInit(): void {
    }

}

export interface NamePropertyConfig {
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
    /* the field of the object(s) to visualize as a name
     * If unspecified, uses 'name' field as defined on StixObject
     */
    field?: string;
}