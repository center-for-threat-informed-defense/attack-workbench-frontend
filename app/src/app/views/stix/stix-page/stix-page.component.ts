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
    public objects$: Observable<StixObject[]>;
    
    /**
     * Parse an object list and build a config for passing into child components
     * @param {StixObject} objects the objects to display
     * @oaram {allVersions} return all versions instead of just a single version
     * @returns {StixViewConfig} the built config
     */
    public buildConfig(objects: StixObject[], allVersions: boolean = false): StixViewConfig {
        return {
            "mode": "view",
            "object": allVersions? objects : objects[0] 
        }
    }

    constructor(private router: Router, private route: ActivatedRoute, private restAPIConnectorService: RestApiConnectorService, private breadcrumbService: BreadcrumbService) { }

    ngOnInit(): void {
        let objectType = this.router.url.split("/")[1];
        let objectStixID = this.route.snapshot.params["id"];
        if (objectType == "software") this.objects$ = this.restAPIConnectorService.getSoftware(objectStixID);
        else if (objectType == "group") this.objects$ = this.restAPIConnectorService.getGroup(objectStixID);
        else if (objectType == "matrix") this.objects$ = this.restAPIConnectorService.getMatrix(objectStixID);
        else if (objectType == "mitigation") this.objects$ = this.restAPIConnectorService.getMitigation(objectStixID);
        else if (objectType == "tactic") this.objects$ = this.restAPIConnectorService.getTactic(objectStixID);
        else if (objectType == "technique") this.objects$ = this.restAPIConnectorService.getTechnique(objectStixID);
        else if (objectType == "collection") this.objects$ = this.restAPIConnectorService.getCollection(objectStixID, null, "all");
        let  subscription = this.objects$.subscribe({
            next: result => {this.updateBreadcrumbs(result, objectType)},
            complete: () => { subscription.unsubscribe() }
        });
    }
    private updateBreadcrumbs(result, objectType) {
        if (result.length == 0) {
            this.breadcrumbService.changeBreadcrumb(this.route.snapshot, "error")
        } else {
            if ("name" in result[0] && result[0].name) {
                this.breadcrumbService.changeBreadcrumb(this.route.snapshot, result[0].name)
            } else {
                this.breadcrumbService.changeBreadcrumb(this.route.snapshot, `unnamed ${objectType}`)
            }
        }
    }
}

