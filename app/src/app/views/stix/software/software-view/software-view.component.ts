import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/classes/stix/group';
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
    public groups: Group[];
    public techniques: Technique[];

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

    constructor(private groupService: GroupService, private techniqueService: TechniqueService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.groups = this.groupService.getAll();
        this.techniques = this.techniqueService.getAll();
        this.route.queryParams.subscribe(params => {
            this.editing = params["editing"];
        });
    }

}
