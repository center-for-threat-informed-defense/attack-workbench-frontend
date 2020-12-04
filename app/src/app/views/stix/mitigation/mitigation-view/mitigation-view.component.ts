import { Component, OnInit } from '@angular/core';
import { TechniqueService } from 'src/app/services/stix/technique/technique.service';
import { ActivatedRoute } from '@angular/router';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { Technique } from 'src/app/classes/stix/technique';
import { ExternalReference } from 'src/app/classes/external-references';

@Component({
  selector: 'app-mitigation-view',
  templateUrl: './mitigation-view.component.html',
  styleUrls: ['./mitigation-view.component.scss']
})
export class MitigationViewComponent implements OnInit {
  
  public techniques: Technique[];

  public editing: boolean = false;

  public mitigation: Mitigation = new Mitigation({
    "created": "2019-06-11T17:06:56.230Z",
    "modified": "2019-06-11T17:06:56.230Z",
    "type": "course-of-action",
    "id": "course-of-action--b9f0c069-abbe-4a07-a245-2481219a1463",
    "name": "Application Isolation and Sandboxing", 
    "description": "Restrict execution of code to a virtual environment on or in transit to an endpoint system.", 
    "created_by_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5", 
    "object_marking_refs": [
      "marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168"
    ],
    "external_references": [
      {
          "url": "https://attack.mitre.org/mitigations/M1048", 
          "source_name": "mitre-attack", 
          "external_id": "M1048"
      }
    ],
    "x_mitre_domains": [
      "enterprise"
    ],
    "spec_version": "2.1", 
    "x_mitre_version": "1.0"
  })

  constructor(private techniqueService: TechniqueService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.techniques = this.techniqueService.getAll();
    this.route.queryParams.subscribe(params => {
        this.editing = params["editing"];
    });
  }

}
