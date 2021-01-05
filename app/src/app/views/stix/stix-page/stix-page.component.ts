import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'angular-crumbs';
import { Observable } from 'rxjs';
import { Software } from 'src/app/classes/stix/software';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixViewConfig } from '../stix-view-page';

@Component({
  selector: 'app-stix-page',
  templateUrl: './stix-page.component.html',
  styleUrls: ['./stix-page.component.scss']
})
export class StixPageComponent implements OnInit {
    public objects$: Observable<StixObject>;
    public buildConfig(objects: StixObject) {
        return {
            "mode": "view",
            "object": objects[0]
        }
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

    constructor(private router: Router, private route: ActivatedRoute, private restAPIConnectorService: RestApiConnectorService, private breadcrumbService: BreadcrumbService) { }

    ngOnInit(): void {
        // console.log(this.router.url.split("/"));
        let objectType = this.router.url.split("/")[1];
        let objectStixID = this.route.snapshot.params["id"];
        // console.log(objectType, objectStixID);
        // let accessors = {
        //     "software":   this.restAPIConnectorService.getSoftware,
        //     // "relationship": this.restAPIConnectorService.getSoftware(objectStixID);
        //     "group":      this.restAPIConnectorService.getGroup,
        //     "matrix":     this.restAPIConnectorService.getMatrix,
        //     "mitigation": this.restAPIConnectorService.getMitigation,
        //     "tactic":     this.restAPIConnectorService.getTactic,
        //     "technique":  this.restAPIConnectorService.getTechnique
        // }
        if (objectType == "software") this.objects$ = this.restAPIConnectorService.getSoftware(objectStixID);
        if (objectType == "group") this.objects$ = this.restAPIConnectorService.getGroup(objectStixID);
        if (objectType == "matrix") this.objects$ = this.restAPIConnectorService.getMatrix(objectStixID);
        if (objectType == "mitigation") this.objects$ = this.restAPIConnectorService.getMitigation(objectStixID);
        if (objectType == "tactic") this.objects$ = this.restAPIConnectorService.getTactic(objectStixID);
        if (objectType == "technique") this.objects$ = this.restAPIConnectorService.getTechnique(objectStixID);
        this.objects$.subscribe(result => {this.updateBreadcrumbs(result)});
    }
    private updateBreadcrumbs(result) {
        if (result.length == 0) {
            this.breadcrumbService.changeBreadcrumb(this.route.snapshot, "error")
        } else {
            if ("name" in result[0]) {
                this.breadcrumbService.changeBreadcrumb(this.route.snapshot, result[0].name)
            } else {
                this.breadcrumbService.changeBreadcrumb(this.route.snapshot, `unnamed ${this.objectType}`)
            }
        }
    }
}

