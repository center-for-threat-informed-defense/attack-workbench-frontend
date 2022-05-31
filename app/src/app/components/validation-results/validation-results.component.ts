import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ValidationData } from 'src/app/classes/serializable';

@Component({
    selector: 'app-validation-results',
    templateUrl: './validation-results.component.html',
    styleUrls: ['./validation-results.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ValidationResultsComponent implements OnInit {
    @Input() validation: ValidationData;

    constructor() {
        // intentionally left blank
    }

    ngOnInit(): void {
        // intentionally left blank
    }
}
