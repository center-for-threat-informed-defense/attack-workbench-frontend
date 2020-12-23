import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tactic } from 'src/app/classes/stix/tactic';
import { StixViewPage } from '../../stix-view-page';

@Component({
  selector: 'app-tactic-view',
  templateUrl: './tactic-view.component.html',
  styleUrls: ['./tactic-view.component.scss']
})
export class TacticViewComponent extends StixViewPage implements OnInit {
  
  public editing: boolean = false;

  public tactic: Tactic = new Tactic({
    "created": "2018-10-17T00:14:20.652Z",
    "modified": "2019-07-19T17:42:06.909Z",
    "name": "Execution",
    "x_mitre_shortname": "execution",
    "type": "x-mitre-tactic",
    "id": "x-mitre-tactic--4ca45d45-df4d-4613-8980-bac22d278fa5",
    "description": "The adversary is trying to run malicious code.\n\nExecution consists of techniques that result in adversary-controlled code running on a local or remote system. Techniques that run malicious code are often paired with techniques from all other tactics to achieve broader goals, like exploring a network or stealing data. For example, an adversary might use a remote access tool to run a PowerShell script that does Remote System Discovery. ",
    "created_by_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5", 
    "object_marking_refs": [
      "marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168"
    ], 
    "external_references": [
      {
          "url": "https://attack.mitre.org/tactics/TA0002", 
          "external_id": "TA0002", 
          "source_name": "mitre-attack"
      }
    ], 
    "x_mitre_domains": [
      "enterprise"
    ],
    "spec_version": "2.1", 
    "x_mitre_version": "1.0",
    "x_mitre_collections": [
      "x_mitre_collection--11c94726-c9dd-4660-b5f1-f8169e2604e1"
    ]
  })

  constructor(private route: ActivatedRoute) { 
    super()
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.editing = params["editing"];
    });
  }

}
