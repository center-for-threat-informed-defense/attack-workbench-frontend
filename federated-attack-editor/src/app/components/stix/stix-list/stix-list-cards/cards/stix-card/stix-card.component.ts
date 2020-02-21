import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-stix-card',
  templateUrl: './stix-card.component.html',
  styleUrls: ['./stix-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StixCardComponent implements OnInit {
    @Input() stixObject: StixObject;

    constructor() { }

    ngOnInit() {
    }

    summarize(text: string): string {
        if(text){
            let suffix = (text.length > 350) ? "..." : ""
            return text.substr(0, 350) + suffix;
        }
        return ""
    }

}
