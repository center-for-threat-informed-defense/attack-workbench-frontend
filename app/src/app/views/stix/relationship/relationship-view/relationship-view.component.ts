import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Relationship } from 'src/app/classes/stix/relationship';
import { StixViewPage } from '../../stix-view-page';

@Component({
  selector: 'app-relationship-view',
  templateUrl: './relationship-view.component.html',
  styleUrls: ['./relationship-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RelationshipViewComponent extends StixViewPage implements OnInit {

    public get relationship() { return this.config.object as Relationship; }

    constructor() { super() }

    ngOnInit(): void {
    }

}
