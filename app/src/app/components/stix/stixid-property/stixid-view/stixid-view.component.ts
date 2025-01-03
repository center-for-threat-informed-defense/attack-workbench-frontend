import { Component, Input, OnInit } from '@angular/core';
import { StixIDPropertyConfig } from '../stixid-property.component';

@Component({
    selector: 'app-stixid-view',
    templateUrl: './stixid-view.component.html',
    styleUrls: ['./stixid-view.component.scss']
})
export class StixIDViewComponent implements OnInit {
    @Input() public config: StixIDPropertyConfig;

    constructor() {
        // intentionally left blank
    }

    ngOnInit(): void {
        // intentionally left blank
    }
}
