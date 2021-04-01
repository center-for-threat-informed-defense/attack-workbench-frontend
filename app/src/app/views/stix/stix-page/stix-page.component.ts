import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { BreadcrumbService } from 'angular-crumbs';
import { Observable } from 'rxjs';
import { Collection } from 'src/app/classes/stix/collection';
import { Group } from 'src/app/classes/stix/group';
import { Matrix } from 'src/app/classes/stix/matrix';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { Software } from 'src/app/classes/stix/software';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { VersionNumber } from 'src/app/classes/version-number';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { MultipleChoiceDialogComponent } from 'src/app/components/multiple-choice-dialog/multiple-choice-dialog.component';
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

    private routerEvents;
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
    public buildConfig(): StixViewConfig {
        return {
            "mode": "view",
            "object": this.objects[0] 
        }
    }

    private save() {
        let versionChanged = this.objects[0].version.compareTo(this.initialVersion) != 0;
        let prompt = this.dialog.open(SaveDialogComponent, { //increment version number save panel
            // maxWidth: "35em",
            data: {
                object: this.objects[0],
                versionAlreadyIncremented: versionChanged
            }
        });

        
        let subscription = prompt.afterClosed().subscribe({
            next: (result) => {
                if (result) {
                    // this.editorService.stopEditing();
                    this.router.navigate([this.objects[0].attackType, this.objects[0].stixID]);
                    setTimeout(() => this.loadObjects());
                    this.editorService.onEditingStopped.emit();
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

        this.routerEvents = this.router.events.subscribe(event => { 
            if (event instanceof NavigationEnd) {
                // Load objects when navigation ends sucessfully
                this.loadObjects(); 
            }
        })
    }

    /**
     * Load the objects forthis page from the REST API
     * @memberof StixPageComponent
     */
    private loadObjects(): void {
        let objectType = this.router.url.split("/")[1];
        let objectStixID = this.route.snapshot.params["id"];
        let objectModified = this.route.snapshot.params["modified"];
        if (objectStixID != "new") {
            // get objects at REST API
            let objects$: Observable<StixObject[]>;
            if (objectType == "software") objects$ = this.restAPIConnectorService.getSoftware(objectStixID);
            else if (objectType == "group") objects$ = this.restAPIConnectorService.getGroup(objectStixID);
            else if (objectType == "matrix") objects$ = this.restAPIConnectorService.getMatrix(objectStixID);
            else if (objectType == "mitigation") objects$ = this.restAPIConnectorService.getMitigation(objectStixID);
            else if (objectType == "tactic") objects$ = this.restAPIConnectorService.getTactic(objectStixID);
            else if (objectType == "technique") objects$ = this.restAPIConnectorService.getTechnique(objectStixID, null, "latest", true); 
            else if (objectType == "collection") objects$ = this.restAPIConnectorService.getCollection(objectStixID, objectModified);
            let  subscription = objects$.subscribe({
                next: result => {
                    this.updateBreadcrumbs(result, objectType);
                    this.objects = result;
                    if (objectModified) this.objects = this.objects.filter(x => x.modified.toISOString() == objectModified); //filter to just the object with that date
                    this.initialVersion = new VersionNumber(this.objects[0].version.toString());
                },
                complete: () => { subscription.unsubscribe() }
            });
        } else if (objectType == "software") {
            // ask the user what sub-type of software they want to create
            let prompt = this.dialog.open(MultipleChoiceDialogComponent, {
                maxWidth: "35em",
                disableClose: true,
                data: {
                    title: "Create a malware or a tool?",
                    choices: [{
                        label: "malware",
                        description: "Commercial, custom closed source, or open source software intended to be used for malicious purposes by adversaries."
                    }, {
                        label: "tool",
                        description: "Commercial, open-source, built-in, or publicly available software that could be used by a defender, pen tester, red teamer, or an adversary."
                    }]
                }
            })
            let subscription = prompt.afterClosed().subscribe({
                next: (result) => {
                    this.objects = [new Software(result)]; 
                    this.initialVersion = new VersionNumber(this.objects[0].version.toString());
                    this.updateBreadcrumbs(this.objects, objectType);
                },
                complete: () => { subscription.unsubscribe(); }
            })
        } else {
            // create a new object to edit
            this.objects = [];
            this.objects.push(
                objectType == "matrix" ? new Matrix() :
                objectType == "technique" ? new Technique() :
                objectType == "tactic" ? new Tactic() :
                objectType == "mitigation" ? new Mitigation() :
                objectType == "group" ? new Group():
                objectType == "collection" ? new Collection() : 
                null // if not any of the above types
            );
            this.initialVersion = new VersionNumber(this.objects[0].version.toString());
            this.updateBreadcrumbs(this.objects, objectType);
        };
    }

    ngOnDestroy() {
        this.saveSubscription.unsubscribe();
        this.routerEvents.unsubscribe();
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

