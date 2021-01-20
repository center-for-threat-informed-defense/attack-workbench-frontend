import { Component, Input, OnInit } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { AttackIDPropertyConfig } from '../attackid-property.component';

@Component({
  selector: 'app-attackid-view',
  templateUrl: './attackid-view.component.html',
  styleUrls: ['./attackid-view.component.scss']
})
export class AttackIDViewComponent implements OnInit {
    @Input() public config: AttackIDPropertyConfig;

    constructor() { }

    ngOnInit(): void {
    }

}
