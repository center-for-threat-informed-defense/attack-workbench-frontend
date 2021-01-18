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

    public mitigations: Relationship[] = [
        new Relationship(
            {
                "created_by_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5", 
                "x_mitre_domains": [
                    "enterprise"
                ], 
                "created": "2017-05-31T21:33:27.026Z", 
                "x_mitre_collections": [
                    "x_mitre_collection--11c94726-c9dd-4660-b5f1-f8169e2604e1"
                ], 
                "spec_version": "2.1", 
                "modified": "2019-07-24T14:13:23.722Z", 
                "target_ref": "attack-pattern--5909f20f-3c39-4795-be06-ef1ea40d350b", 
                "object_marking_refs": [
                    "marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168"
                ], 
                "relationship_type": "mitigates", 
                "x_mitre_version": "1.0", 
                "type": "relationship", 
                "id": "relationship--483a70b9-eae9-4d5f-925c-95c2dd7b9fa5", 
                "source_ref": "course-of-action--beb45abb-11e8-4aef-9778-1f9ac249784f"
            }
        )
    ];

    public subtechniques: Relationship[];
    public groups: Relationship[];
    public software: Relationship[];

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
