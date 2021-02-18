import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'angular-crumbs';
import { Observable } from 'rxjs';
import { Group } from 'src/app/classes/stix/group';
import { Matrix } from 'src/app/classes/stix/matrix';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { Software } from 'src/app/classes/stix/software';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { VersionNumber } from 'src/app/classes/version-number';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { SaveDialogComponent } from 'src/app/components/save-dialog/save-dialog.component';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { EditorService } from 'src/app/services/editor/editor.service';
import { StixViewConfig } from '../stix-view-page';

@Component({
  selector: 'app-stix-page',
  templateUrl: './stix-page.component.html',
  styleUrls: ['./stix-page.component.scss']
})
export class StixPageComponent implements OnInit, OnDestroy {
    public objects: StixObject[];
    public initialVersion: VersionNumber;

    private saveSubscription;
    
    constructor(private router: Router, 
                private route: ActivatedRoute, 
                private restAPIConnectorService: RestApiConnectorService, 
                private breadcrumbService: BreadcrumbService, 
                private editorService: EditorService,
                private dialog: MatDialog) { }
    
    /**
     * Parse an object list and build a config for passing into child components
     * @param {StixObject} objects the objects to display
     * @oaram {allVersions} return all versions instead of just a single version
     * @returns {StixViewConfig} the built config
     */
    public buildConfig(allVersions: boolean = false): StixViewConfig {
        return {
            "mode": "view",
            "object": allVersions? this.objects : this.objects[0] 
        }
    }

    private save() {
        let versionChanged = this.objects[0].version.compareTo(this.initialVersion) != 0;
        let prompt = versionChanged ? //has version been incremented during edits
            this.dialog.open(ConfirmationDialogComponent, { //already incremented
                maxWidth: "35em",
                data: { 
                    message: `# Save changes?`,
                }
            }) :
            this.dialog.open(SaveDialogComponent, { //increment version number save panel
                // maxWidth: "35em",
                data: this.objects[0].version
            });

        
        let subscription = prompt.afterClosed().subscribe({
            next: (result) => {
                if (result && typeof(result) == "string") {
                    // increment the version number 
                    console.log("updating version to", result);
                    this.objects[0].version.version = result;
                }
                if (result) {
                    // save the object
                    let subscription = this.objects[0].save(true, this.restAPIConnectorService).subscribe({
                        next: (result) => { 
                            this.editorService.stopEditing();
                            this.loadObjects();
                        },
                        complete: () => {subscription.unsubscribe(); }
                    });
                }

            },
            complete: () => { subscription.unsubscribe(); } //prevent memory leaks
        })
    }


    ngOnInit(): void {
        this.loadObjects();
        this.saveSubscription = this.editorService.onSave.subscribe({
            next: (event) => this.save()
        });
    }

    /**
     * Load the objects forthis page from the REST API
     * @memberof StixPageComponent
     */
    private loadObjects(): void {
        let objectType = this.router.url.split("/")[1];
        let objectStixID = this.route.snapshot.params["id"];
        if (objectStixID != "new") {
            // get objects at REST API
            let objects$: Observable<StixObject[]>;
            if (objectType == "software") objects$ = this.restAPIConnectorService.getSoftware(objectStixID);
            else if (objectType == "group") objects$ = this.restAPIConnectorService.getGroup(objectStixID);
            else if (objectType == "matrix") objects$ = this.restAPIConnectorService.getMatrix(objectStixID);
            else if (objectType == "mitigation") objects$ = this.restAPIConnectorService.getMitigation(objectStixID);
            else if (objectType == "tactic") objects$ = this.restAPIConnectorService.getTactic(objectStixID);
            else if (objectType == "technique") objects$ = this.restAPIConnectorService.getTechnique(objectStixID);
            else if (objectType == "collection") objects$ = this.restAPIConnectorService.getCollection(objectStixID, null, "all");
            let  subscription = objects$.subscribe({
                next: result => {
                    this.updateBreadcrumbs(result, objectType);
                    this.objects = result;
                    this.initialVersion = new VersionNumber(this.objects[0].version.toString());
                },
                complete: () => { subscription.unsubscribe() }
            });
        } else {
            // create a new object to edit
            this.objects = [];
            this.objects.push(
                objectType == "matrix" ? new Matrix() :
                objectType == "technique" ? new Technique() :
                objectType == "tactic" ? new Tactic() :
                objectType == "mitigation" ? new Mitigation() :
                objectType == "group" ? new Group():
                objectType == "software" ? new Software("tool") : null
            );
            this.initialVersion = new VersionNumber(this.objects[0].version.toString());
        };
    }

    ngOnDestroy() {
        this.saveSubscription.unsubscribe();
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

