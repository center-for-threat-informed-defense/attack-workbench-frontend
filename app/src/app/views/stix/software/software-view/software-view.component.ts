import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'angular-crumbs';
import { Group } from 'src/app/classes/stix/group';
import { Relationship } from 'src/app/classes/stix/relationship';
import { Software } from 'src/app/classes/stix/software';
import { Technique } from 'src/app/classes/stix/technique';
import { GroupService } from 'src/app/services/stix/group/group.service';
import { SoftwareService } from 'src/app/services/stix/software/software.service';
import { TechniqueService } from 'src/app/services/stix/technique/technique.service';

@Component({
  selector: 'app-software-view',
  templateUrl: './software-view.component.html',
  styleUrls: ['./software-view.component.scss']
})
export class SoftwareViewComponent implements OnInit {
    public editing: boolean = false;

    public software: Software = new Software("malware", {
        "created": "2019-10-11T16:13:19.588Z",
        "modified": "2020-11-10T12:34:22.990Z",
        "labels": [
            "malware"
        ],
        "type": "malware",
        "id": "malware--065196de-d7e8-4888-acfb-b2134022ba1b",
        "name": "RDFSNIFFER",
        "description": "[RDFSNIFFER](https://attack.mitre.org/software/S0416) is a module loaded by [BOOSTWRITE](https://attack.mitre.org/software/S0415) which allows an attacker to monitor and tamper with legitimate connections made via an application designed to provide visibility and system management capabilities to remote IT techs.(Citation: FireEye FIN7 Oct 2019)",
        "created_by_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5",
        "object_marking_refs": [
            "marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168"
        ],
        "external_references": [
            {
                "external_id": "S0416",
                "source_name": "mitre-attack",
                "url": "https://attack.mitre.org/software/S0416"
            },
            {
                "source_name": "FireEye FIN7 Oct 2019",
                "url": "https://www.fireeye.com/blog/threat-research/2019/10/mahalo-fin7-responding-to-new-tools-and-techniques.html",
                "description": "Carr, N, et all. (2019, October 10). Mahalo FIN7: Responding to the Criminal Operators New Tools and Techniques. Retrieved October 11, 2019."
            },
            {
                "source_name": "FireEye FIN7 Oct 2018",
                "description": "Zarr, N, et all. (2019, October 10). Mahalo FIN7: Responding to the Criminal Operators New Tools and Techniques. Retrieved October 11, 2019."
            },
            {
                "source_name": "FireEye FIN7 Oct 2017",
                "url": "https://www.fireeye.com/blog/threat-research/2019/10/mahalo-fin7-responding-to-new-tools-and-techniques.html",
                "description": "Barr, N, et all. (2019, October 10). Mahalo FIN7: Responding to the Criminal Operators New Tools and Techniques. Retrieved October 11, 2019."
            },
            {
                "source_name": "FireEye FIN7 Oct 2016",
                "url": "https://www.fireeye.com/blog/threat-research/2019/10/mahalo-fin7-responding-to-new-tools-and-techniques.html",
                "description": "Farr, N, et all. (2019, October 10). Mahalo FIN7: Responding to the Criminal Operators New Tools and Techniques. Retrieved October 11, 2019."
            }
        ],
        "x_mitre_platforms": [
            "Windows", "macOS", "Linux", "AWS", "Large Dogs", "Pencils", "Norway", "Combat Wombats"
        ],
        "x_mitre_aliases": [
            "RDFSNIFFER"
        ],
        "x_mitre_version": "1.0"
    })
    public relationships_techniques: Relationship[] = [new Relationship({
        "created_by_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5",
        "object_marking_refs": ["marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168"],
        "external_references": [{
            "description": "Carr, N, et all. (2019, October 10). Mahalo FIN7: Responding to the Criminal Operators\\u2019 New Tools and Techniques. Retrieved October 11, 2019.",
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
    }), new Relationship({
        "created_by_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5",
        "object_marking_refs": ["marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168"],
        "external_references": [{
            "description": "Carr, N, et all. (2019, October 10). Mahalo FIN7: Responding to the Criminal Operators\\u2019 New Tools and Techniques. Retrieved October 11, 2019.",
            "url": "https://www.fireeye.com/blog/threat-research/2019/10/mahalo-fin7-responding-to-new-tools-and-techniques.html",
            "source_name": "FireEye FIN7 Oct 2019"
        }],
        "description": "[RDFSNIFFER](https://attack.mitre.org/software/S0416) has the capability of deleting local files.(Citation: FireEye FIN7 Oct 2019)",
        "id": "relationship--81d5c85f-ea7c-47a2-879c-df34e93d88c2",
        "type": "relationship",
        "modified": "2019-10-11T16:13:19.709Z",
        "created": "2019-10-11T16:13:19.709Z",
        "source_ref": "malware--065196de-d7e8-4888-acfb-b2134022ba1b",
        "source_name": "RDFSNIFFER", // THIS IS NOT PART OF THE SPEC, AND IS A PLACEHOLDER
        "relationship_type": "uses",
        "target_ref": "attack-pattern--d63a3fb8-9452-4e9d-a60a-54be68d5998c",
        "target_name": "Indicator Removal on Host: File Deletion" // THIS IS NOT PART OF THE SPEC, AND IS A PLACEHOLDER
    }), new Relationship({
        "created_by_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5",
        "object_marking_refs": ["marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168"],
        "external_references": [{
            "description": "Carr, N, et all. (2019, October 10). Mahalo FIN7: Responding to the Criminal Operators\\u2019 New Tools and Techniques. Retrieved October 11, 2019.",
            "url": "https://www.fireeye.com/blog/threat-research/2019/10/mahalo-fin7-responding-to-new-tools-and-techniques.html",
            "source_name": "FireEye FIN7 Oct 2019"
        }],
        "description": "[RDFSNIFFER](https://attack.mitre.org/software/S0416) has used several Win32 API functions to interact with the victim machine.(Citation: FireEye FIN7 Oct 2019)",
        "id": "relationship--bcd66737-6beb-4cf8-9ba1-8a32731d1da1",
        "type": "relationship",
        "modified": "2019-10-11T16:13:19.695Z",
        "created": "2019-10-11T16:13:19.695Z",
        "source_ref": "malware--065196de-d7e8-4888-acfb-b2134022ba1b",
        "source_name": "RDFSNIFFER", // THIS IS NOT PART OF THE SPEC, AND IS A PLACEHOLDER
        "relationship_type": "uses",
        "target_ref": "attack-pattern--391d824f-0ef1-47a0-b0ee-c59a75e27670",
        "target_name": "Native API" // THIS IS NOT PART OF THE SPEC, AND IS A PLACEHOLDER
    })]
    public relationships_groups: Relationship[] = [new Relationship({
        "created_by_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5",
        "object_marking_refs": ["marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168"],
        "external_references": [{
            "description": "Carr, N, et all. (2019, October 10). Mahalo FIN7: Responding to the Criminal Operators\\u2019 New Tools and Techniques. Retrieved October 11, 2019.",
            "url": "https://www.fireeye.com/blog/threat-research/2019/10/mahalo-fin7-responding-to-new-tools-and-techniques.html",
            "source_name": "FireEye FIN7 Oct 2019"
        }],
        "description": "(Citation: FireEye FIN7 Oct 2019)",
        "id": "relationship--cc99be16-89cc-427a-b348-2236add3d816",
        "type": "relationship",
        "modified": "2019-10-11T16:14:20.334Z",
        "created": "2019-10-11T16:14:20.334Z",
        "source_ref": "intrusion-set--3753cc21-2dae-4dfb-8481-d004e74502cc",
        "source_name": "FIN7", // THIS IS NOT PART OF THE SPEC, AND IS A PLACEHOLDER
        "relationship_type": "uses",
        "target_ref": "malware--065196de-d7e8-4888-acfb-b2134022ba1b",
        "target_name": "RDFSNIFFER" // THIS IS NOT PART OF THE SPEC, AND IS A PLACEHOLDER
    })]

    constructor(private route: ActivatedRoute, private breadcrumbService: BreadcrumbService) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.editing = params["editing"];
        });
        // set the breadcrumb to the software name
        this.breadcrumbService.changeBreadcrumb(this.route.snapshot, this.software.name);
        // TODO set the page title to the software name using titleService
    }

}
