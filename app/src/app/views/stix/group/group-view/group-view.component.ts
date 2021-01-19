import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/classes/stix/group';
import { StixViewPage } from '../../stix-view-page';
import { Relationship } from 'src/app/classes/stix/relationship';

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.scss']
})
export class GroupViewComponent extends StixViewPage implements OnInit {
  
  public editing: boolean = false;
  
  public get group(): Group { return this.config.object as Group; }

  public relationships_techniques: Relationship[] = [new Relationship({
    "created_by_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5",
    "object_marking_refs": ["marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168"],
    "external_references": [{
        "description": "Carr, N, et all. (2019, October 10). Mahalo FIN7: Responding to the Criminal Operators' New Tools and Techniques. Retrieved October 11, 2019.",
        "url": "https://www.fireeye.com/blog/threat-research/2019/10/mahalo-fin7-responding-to-new-tools-and-techniques.html",
        "source_name": "FireEye FIN7 Oct 2019"
    }],
    "description": "[RDFSNIFFER](https://attack.mitre.org/software/S0416) hooks several Win32 API functions to hijack elements of the remote system management user-interface.(Citation: FireEye FIN7 Oct 2019)",
    "id": "relationship--71a3a771-3674-4b44-8742-bed627f178b3",
    "type": "relationship",
    "modified": "2019-10-11T16:13:19.711Z",
    "created": "2019-10-11T16:13:19.711Z",
    "source_ref": "malware--065196de-d7e8-4888-acfb-b2134022ba1b",
    "source_name": "RDFSNIFFER", // THIS IS NOT PART OF THE SPEC, AND IS A PLACEHOLDER
    "relationship_type": "uses",
    "target_ref": "attack-pattern--f5946b5e-9408-485f-a7f7-b5efc88909b6",
    "target_name": "Input Capture: Credential API Hooking" // THIS IS NOT PART OF THE SPEC, AND IS A PLACEHOLDER
  })]

  public relationships_software: Relationship[] = [new Relationship({
    "created_by_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5", 
    "external_references": [
        {
            "url": "https://www.fireeye.com/blog/threat-research/2019/04/pick-six-intercepting-a-fin6-intrusion.html", 
            "source_name": "FireEye FIN6 Apr 2019", 
            "description": "McKeague, B. et al. (2019, April 5). Pick-Six: Intercepting a FIN6 Intrusion, an Actor Recently Tied to Ryuk and LockerGoga Ransomware. Retrieved April 17, 2019."
        }
    ], 
    "created": "2019-04-17T14:45:59.674Z", 
    "x_mitre_collections": [
        "x_mitre_collection--11c94726-c9dd-4660-b5f1-f8169e2604e1"
    ], 
    "x_mitre_domains": [
        "enterprise"
    ], 
    "spec_version": "2.1", 
    "modified": "2019-06-28T14:59:17.854Z", 
    "target_ref": "tool--aafea02e-ece5-4bb2-91a6-3bf8c7f38a39", 
    "object_marking_refs": [
        "marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168"
    ], 
    "relationship_type": "uses", 
    "x_mitre_version": "1.0", 
    "type": "relationship", 
    "id": "relationship--935681a5-d027-4c13-8565-54cd8505bf61", 
    "source_ref": "intrusion-set--2a7914cf-dff3-428d-ab0f-1014d1c28aeb",
    "source_name": "OilRig", // THIS IS NOT PART OF THE SPEC, AND IS A PLACEHOLDER
    "target_name": "Cobalt Strike" // THIS IS NOT PART OF THE SPEC, AND IS A PLACEHOLDER
  })]


  constructor(private route: ActivatedRoute) { 
    super()
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
        this.editing = params["editing"];
    });
  }

}
