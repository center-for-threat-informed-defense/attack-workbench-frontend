import { Component, Input } from '@angular/core';
import { ExternalReferences } from 'src/app/classes/external-references';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
    selector: 'app-citation-property',
    templateUrl: './citation-property.component.html',
    styleUrls: ['./citation-property.component.scss']
})
export class CitationPropertyComponent {
    @Input() public config: CitationPropertyConfig;

    constructor() {
        // intentionally left blank
    }

}

export interface CitationPropertyConfig {
    /* What is the current mode? Default: 'view'
     *    view: viewing the descriptive property
     *    edit: editing the descriptive property
     */
    mode?: "view" | "edit" | "diff";
    /* The object to show the citation field of
     * Note: if mode is diff, pass an array of two objects to diff
     */
    object: StixObject | [StixObject, StixObject];
    /** The field of the object to be displayed */
    field: string;
    /* Theexternal references object. 
     * References will be removed if not included 
     */
    referencesField?: ExternalReferences;
    /* The label for labelled box */
    label: string;
}