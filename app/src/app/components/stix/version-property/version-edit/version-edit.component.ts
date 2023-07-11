import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { VersionPropertyConfig } from '../version-property.component';

@Component({
    selector: 'app-version-edit',
    templateUrl: './version-edit.component.html',
    styleUrls: ['./version-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VersionEditComponent implements OnInit {
    @Input() public config: VersionPropertyConfig;

    constructor() {
        // intentionally left blank
    }

    ngOnInit(): void {
        // intentionally left blank
    }
}
