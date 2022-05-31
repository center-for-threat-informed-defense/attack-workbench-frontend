import { Component, Input, OnInit } from '@angular/core';
import { AttackIDPropertyConfig } from '../attackid-property.component';

@Component({
    selector: 'app-attackid-view',
    templateUrl: './attackid-view.component.html',
    styleUrls: ['./attackid-view.component.scss']
})
export class AttackIDViewComponent implements OnInit {
    @Input() public config: AttackIDPropertyConfig;

    constructor() {
        // intentionally left blank
    }

    ngOnInit(): void {
        // intentionally left blank
    }
}
