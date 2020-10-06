import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-stix-list-cards',
  templateUrl: './stix-list-cards.component.html',
  styleUrls: ['./stix-list-cards.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StixListCardsComponent implements OnInit {
    @Input() stixObjects: StixObject[];

    constructor() {}

    ngOnInit() {}

    

}
