import { Component, Input } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
    selector: 'app-version-property',
    templateUrl: './version-property.component.html'
})
export class VersionPropertyComponent {
    @Input() public config: VersionPropertyConfig;

    public get object(): StixObject {
        return Array.isArray(this.config.object) ? this.config.object[1] : this.config.object;
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