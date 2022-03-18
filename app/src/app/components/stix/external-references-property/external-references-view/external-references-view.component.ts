import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ExternalReference } from 'src/app/classes/external-references';
import { ExternalReferencesPropertyConfig } from '../external-references-property.component';

@Component({
    selector: 'app-external-references-view',
    templateUrl: './external-references-view.component.html',
    styleUrls: ['./external-references-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ExternalReferencesViewComponent implements OnInit {
    @Input() public config: ExternalReferencesPropertyConfig;
    public referenceList: Array<[number, ExternalReference]> = [];

    constructor() { }

    ngOnInit(): void {
        this.referenceList = this.config.referencesField.list();
    }
}
