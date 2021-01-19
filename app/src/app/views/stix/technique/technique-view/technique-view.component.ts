import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Technique } from 'src/app/classes/stix/technique';
import { StixViewPage } from '../../stix-view-page';
import { Relationship } from 'src/app/classes/stix/relationship';
import { Tactic } from 'src/app/classes/stix/tactic';

@Component({
  selector: 'app-technique-view',
  templateUrl: './technique-view.component.html',
  styleUrls: ['./technique-view.component.scss']
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

        // GET RELATIONSHIPS FUNCTIONS NOT YET IMPLEMENTED
        // this.subtechniques = this.technique.getRelationships('subtechnique-of');
        // this.mitigations = this.technique.getRelationshipsFrom('course-of-action', 'mitigates');
        // this.groups = this.technique.getRelationshipsFrom('intrusion-set', 'uses');
        // this.software = this.technique.getRelationshipsFrom('malware', 'uses').concat(
        //                 this.technique.getRelationshipsFrom('tool', 'uses'));
    }
}
