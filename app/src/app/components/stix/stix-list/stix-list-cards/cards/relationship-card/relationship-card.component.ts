import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StixCardComponent } from '../stix-card/stix-card.component';
import { Relationship } from 'src/app/classes/stix/relationship';

@Component({
  selector: 'app-relationship-card',
  templateUrl: './relationship-card.component.html',
  styleUrls: ['./relationship-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RelationshipCardComponent extends StixCardComponent implements OnInit {
    private relationship: Relationship = new Relationship({
        "type": "relationship",
        "target_ref": "Brute Force",
        "description": "Set account lockout policies after a certain number of failed login attempts to prevent passwords from being guessed. Too strict a policy may create a denial of service condition and render environments un-usable, with all accounts used in the brute force being locked-out.",
        "created_by_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5",
        "created": "2017-12-14T16:46:06.044Z",
        "id": "relationship--02206f22-80e9-4f87-9e4b-5c1df1eb737e",
        "source_ref": "Account Use Policies",
        "modified": "2018-10-17T00:14:20.652Z",
        "object_marking_refs": [
            "marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168"
        ],
        "external_references": [
            {
                "description": "Settle, A., et al. (2016, August 8). MONSOON - Analysis Of An APT Campaign. Retrieved September 22, 2016.",
                "source_name": "Forcepoint Monsoon",
                "url": "https://www.forcepoint.com/sites/default/files/resources/files/forcepoint-security-labs-monsoon-analysis-report.pdf"
            }
        ],
        "relationship_type": "mitigates",
        "x_mitre_version": "0.1.1"
    });

    constructor() { super() }

    ngOnInit() {
    }

}
