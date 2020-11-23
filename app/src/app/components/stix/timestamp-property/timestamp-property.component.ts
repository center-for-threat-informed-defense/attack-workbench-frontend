import { Component, Input, OnInit } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-timestamp-property',
  templateUrl: './timestamp-property.component.html',
  styleUrls: ['./timestamp-property.component.scss']
})
export class TimestampPropertyComponent implements OnInit {
    @Input() public config: TimestampPropertyConfig;

    constructor() { }

    ngOnInit(): void {
    }

}

export interface TimestampPropertyConfig {
    /* What is the current mode? Default: 'view
     *    view: viewing the timestamp property
     *    diff: displaying the diff between two STIX objects. If this mode is selected, two StixObjects must be specified in the objects field
     */
    mode?: "view" | "diff";
    /* The object to show the timestamp of
     * Note: if mode is diff, pass an array of two objects to diff
     */
    object: StixObject | [StixObject, StixObject];
    /* the field of the object(s) to visualize as a timestamp. Typically "created" or "modified"
     */
    field: string;
}