import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Technique } from 'src/app/classes/stix/technique';
import { StixViewPage } from '../../stix-view-page';
import { Relationship } from 'src/app/classes/stix/relationship';
import { Tactic } from 'src/app/classes/stix/tactic';
import { StixListComponent } from 'src/app/components/stix/stix-list/stix-list.component';

@Component({
  selector: 'app-technique-view',
  templateUrl: './technique-view.component.html',
  styleUrls: ['./technique-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TechniqueViewComponent extends StixViewPage implements OnInit {

    public editing: boolean = false;

    public get technique(): Technique { return this.config.object as Technique; }

    constructor(private route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.editing = params["editing"];
        });
    }
}
