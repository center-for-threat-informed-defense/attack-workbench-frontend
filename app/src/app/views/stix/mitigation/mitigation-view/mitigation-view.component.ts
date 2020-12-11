import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { StixViewPage } from '../../stix-view-page';
import { Relationship } from 'src/app/classes/stix/relationship';

@Component({
  selector: 'app-mitigation-view',
  templateUrl: './mitigation-view.component.html',
  styleUrls: ['./mitigation-view.component.scss']
})
export class MitigationViewComponent extends StixViewPage implements OnInit {
  
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

  public relationships: Relationship[] = [
      new Relationship({
          "created_by_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5", 
          "description": "Browser sandboxes can be used to mitigate some of the impact of exploitation, but sandbox escapes may still exist.\n\nOther types of virtualization and application microsegmentation may also mitigate the impact of client-side exploitation. The risks of additional exploits and weaknesses in implementation may still exist for these types of systems.", 
          "created": "2019-06-24T13:38:13.125Z", 
          "x_mitre_collections": [
              "x_mitre_collection--11c94726-c9dd-4660-b5f1-f8169e2604e1"
          ], 
          "x_mitre_domains": [
              "enterprise"
          ], 
          "spec_version": "2.1", 
          "modified": "2019-10-11T22:45:52.215Z", 
          "target_ref": "attack-pattern--d742a578-d70e-4d0e-96a6-02a9c30204e6", 
          "object_marking_refs": [
              "marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168"
          ], 
          "external_references": [
              {
                  "url": "https://blogs.windows.com/msedgedev/2017/03/23/strengthening-microsoft-edge-sandbox/", 
                  "source_name": "Windows Blogs Microsoft Edge Sandbox", 
                  "description": "Cowan, C. (2017, March 23). Strengthening the Microsoft Edge Sandbox. Retrieved March 12, 2018."
              }, 
              {
                  "url": "https://arstechnica.com/information-technology/2017/03/hack-that-escapes-vm-by-exploiting-edge-browser-fetches-105000-at-pwn2own/", 
                  "source_name": "Ars Technica Pwn2Own 2017 VM Escape", 
                  "description": "Goodin, D. (2017, March 17). Virtual machine escape fetches $105,000 at Pwn2Own hacking contest - updated. Retrieved March 12, 2018."
              }
          ], 
          "relationship_type": "mitigates", 
          "x_mitre_version": "1.0", 
          "type": "relationship", 
          "id": "relationship--56f490de-51e8-47c4-9eae-ecdd1a55e6ef", 
          "source_ref": "course-of-action--b9f0c069-abbe-4a07-a245-2481219a1463",

          // TODO: these are placeholders that the back-end will return some other way when relationships are retrieved
          // they're just here for the mockup
          "source_name": "Application Isolation and Sandboxing",
          "target_name": "Drive-by Compromise",
      })
  ]

  constructor(private route: ActivatedRoute) { 
    super()
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
        this.editing = params["editing"];
    });
  }

}
