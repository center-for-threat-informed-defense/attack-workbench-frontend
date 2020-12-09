import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Software } from 'src/app/classes/stix/software';
import { StixViewConfig } from '../stix-view-page';

@Component({
  selector: 'app-stix-page',
  templateUrl: './stix-page.component.html',
  styleUrls: ['./stix-page.component.scss']
})
export class StixPageComponent implements OnInit {
    public config: StixViewConfig = {
        "mode": "view",
        "object": new Software("malware", {
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
        }), //todo initialize this from the backend
    }

    public get stixType() { // TODO this should come from the retrieved STIX object
        if (this.router.url.includes("software")) return "tool";
        else if (this.router.url.includes("relationship")) return "relationship";
        else if (this.router.url.includes("group")) return "intrusion-set";
        else if (this.router.url.includes("matrix")) return "x-mitre-matrix";
        else if (this.router.url.includes("mitigation")) return "course-of-action";
        else if (this.router.url.includes("tactic")) return "x-mitre-tactic";
        else if (this.router.url.includes("technique")) return "attack-pattern";
        else if (this.router.url.includes("collection")) return "x-mitre-collection";

    }

    constructor(private router: Router) { }

    ngOnInit(): void {
        // this.backendService.get(this.objectID).subscribe((object) => { // TODO what is backendService
        //     this.object = object;
        //     this.breadcrumbService.changeBreadcrumb(this.route.snapshot, this.object.name);
        // });
        // if (this.diffObjectID) {
        //     this.backendService.get(this.diffObjectID).subscribe((diffObject) => {
        //         this.diffObject = diffObject; 
        //     })
        // }
        
        // this.route.queryParams.subscribe(params => {
        //     this.editing = params["editing"];
        // });
    }
}

