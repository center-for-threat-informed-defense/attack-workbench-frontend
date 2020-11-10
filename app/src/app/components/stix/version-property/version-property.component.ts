import { Component, Input, OnInit } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-version-property',
  templateUrl: './version-property.component.html',
  styleUrls: ['./version-property.component.scss']
})
export class VersionPropertyComponent implements OnInit {
    @Input() public config: VersionPropertyConfig;

    constructor() { }

    ngOnInit(): void {
    }

}

export interface VersionPropertyConfig {
    /* What is the current mode? Default: 'view
     *    view: viewing the version property
     *    edit: editing the version property
     *    diff: displaying the diff between two STIX objects. If this mode is selected, two StixObjects must be specified in the objects field
     */
    mode?: "view" | "edit" | "diff";
    /* The object to show the version of
     * Note: if mode is diff, pass an array of two objects to diff
     */
    object: StixObject | [StixObject, StixObject];
    /* the field of the object(s) to visualize as a version
     * If unspecified, uses 'version' field as defined on StixObject
     */
    field?: string;
}