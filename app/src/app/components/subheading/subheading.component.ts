import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-subheading',
  templateUrl: './subheading.component.html',
  styleUrls: ['./subheading.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SubheadingComponent implements OnInit {
    @Input() public config: SubheadingConfig

    constructor() { }

    ngOnInit(): void {
    }

}
export interface SubheadingConfig {
    // the object to display a subheading for
    object: StixObject
}
