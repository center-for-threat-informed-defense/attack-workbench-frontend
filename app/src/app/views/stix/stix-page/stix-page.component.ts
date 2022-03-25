import { Component, OnDestroy, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { BreadcrumbService } from 'angular-crumbs';
import { Observable } from 'rxjs';
import { Collection } from 'src/app/classes/stix/collection';
import { DataSource } from 'src/app/classes/stix/data-source';
import { Group } from 'src/app/classes/stix/group';
import { MarkingDefinition } from 'src/app/classes/stix/marking-definition';
import { Matrix } from 'src/app/classes/stix/matrix';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { Software } from 'src/app/classes/stix/software';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { VersionNumber } from 'src/app/classes/version-number';
import { MultipleChoiceDialogComponent } from 'src/app/components/multiple-choice-dialog/multiple-choice-dialog.component';
import { SaveDialogComponent } from 'src/app/components/save-dialog/save-dialog.component';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { EditorService } from 'src/app/services/editor/editor.service';
import { TitleService } from 'src/app/services/title/title.service';
import { CollectionViewComponent } from '../collection/collection-view/collection-view.component';
import { MarkingDefinitionViewComponent } from '../marking-definition/marking-definition-view/marking-definition-view.component';
import { StixViewConfig } from '../stix-view-page';

@Component({
  selector: 'app-stix-page',
  templateUrl: './stix-page.component.html',
  styleUrls: ['./stix-page.component.scss']
})
export class StixPageComponent implements OnInit, OnDestroy {
    public objects: StixObject[];
    public initialVersion: VersionNumber;
    public objectType: string;
    private objectID: string;
    private routerEvents;
    private saveSubscription;
    private reloadSubscription;

    @Output() created = new EventEmitter();

    @ViewChild(CollectionViewComponent) private collectionViewComponent: CollectionViewComponent;
    @ViewChild(MarkingDefinitionViewComponent) private markingDefinitionViewComponent: MarkingDefinitionViewComponent;
    
    constructor(private router: Router, 
                private route: ActivatedRoute, 
                private restAPIConnectorService: RestApiConnectorService, 
                private breadcrumbService: BreadcrumbService, 
                private editorService: EditorService,
                private dialog: MatDialog,
                private titleService: TitleService) { }
    
    /**
     * Parse an object list and build a config for passing into child components
     * @param {StixObject} objects the objects to display
     * @oaram {allVersions} return all versions instead of just a single version
     * @returns {StixViewConfig} the built config
     */
    public buildConfig(): StixViewConfig {
        return {
            "mode": this.editorService.editing? "edit" : "view",
            "object": this.objects[0] 
        }
    }

    private save() {
        if (this.objectType == "collection") {
            // pass into collection property component
            this.collectionViewComponent.validate();
        } 
        else if(this.objectType == "marking-definition") {
            // pass into marking definition property component
            this.markingDefinitionViewComponent.validate();
        }
        else {
            let versionChanged = this.objects[0].version.compareTo(this.initialVersion) != 0;
            let prompt = this.dialog.open(SaveDialogComponent, { // increment version number save panel
                data: {
                    object: this.objects[0],
                    // patch LinkByIds on other objects if this object's ATT&CK ID has changed
                    patchID: this.objects[0].supportsAttackID && this.objectID && this.objectID != this.objects[0].attackID ? this.objectID : undefined,
                    versionAlreadyIncremented: versionChanged
                }
            });
            
            let subscription = prompt.afterClosed().subscribe({
                next: (result) => {
                    if (result) {
                        this.router.navigate([this.objects[0].attackType, this.objects[0].stixID]);
                        setTimeout(() => { this.loadObjects() }, 500);
                        this.editorService.onEditingStopped.emit();
                    }
                },
                complete: () => { subscription.unsubscribe(); } // prevent memory leaks
            })
        }
    }


    ngOnInit(): void {
        this.loadObjects();
        this.saveSubscription = this.editorService.onSave.subscribe({
            next: (event) => this.save()
        });
        this.reloadSubscription = this.editorService.onReload.subscribe({
            next: (event) => {
                this.objects = undefined;
                this.loadObjects();
            }
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
        this.objectType = this.router.url.split("/")[1];
        let objectStixID = this.route.snapshot.params["id"];
        let objectModified = this.route.snapshot.params["modified"];
        if (objectStixID && objectStixID != "new") {
            // get objects at REST API
            let objects$: Observable<StixObject[]>;
            if (this.objectType  == "software") objects$ = this.restAPIConnectorService.getSoftware(objectStixID);
            else if (this.objectType  == "group") objects$ = this.restAPIConnectorService.getGroup(objectStixID);
            else if (this.objectType  == "matrix") objects$ = this.restAPIConnectorService.getMatrix(objectStixID);
            else if (this.objectType  == "mitigation") objects$ = this.restAPIConnectorService.getMitigation(objectStixID);
            else if (this.objectType  == "tactic") objects$ = this.restAPIConnectorService.getTactic(objectStixID);
            else if (this.objectType  == "technique") objects$ = this.restAPIConnectorService.getTechnique(objectStixID, null, "latest", true); 
            else if (this.objectType  == "collection") objects$ = this.restAPIConnectorService.getCollection(objectStixID, objectModified, "latest", false, true);
            else if (this.objectType  == "data-source") objects$ = this.restAPIConnectorService.getDataSource(objectStixID, null, "latest", false, false, true);
            else if (this.objectType  == "data-component") objects$ = this.restAPIConnectorService.getDataComponent(objectStixID);
            else if (this.objectType  == "marking-definition") objects$ = this.restAPIConnectorService.getMarkingDefinition(objectStixID);
            let  subscription = objects$.subscribe({
                next: result => {
                    this.updateBreadcrumbs(result, this.objectType );
                    this.objects = result;
                    if (objectModified) this.objects = this.objects.filter(x => x.modified.toISOString() == objectModified); //filter to just the object with that date
                    if (this.objects.length > 0) this.initialVersion = new VersionNumber(this.objects[0].version.toString());
                    this.objectID = this.objects[0].supportsAttackID ? this.objects[0].attackID : null;
                },
                complete: () => { subscription.unsubscribe() }
            });
        } else if (this.objectType  == "software") {
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
                    this.updateBreadcrumbs(this.objects, this.objectType);
                },
                complete: () => { subscription.unsubscribe(); }
            })
        } else {
            // create a new object to edit
            this.objects = [];
            this.objects.push(
                this.objectType  == 'matrix' ? new Matrix() :
                this.objectType  == 'technique' ? new Technique() :
                this.objectType  == 'tactic' ? new Tactic() :
                this.objectType  == 'mitigation' ? new Mitigation() :
                this.objectType  == 'group' ? new Group() :
                this.objectType  == 'collection' ? new Collection() :
                this.objectType  == 'data-source' ? new DataSource() :
                this.objectType  == 'marking-definition' ? new MarkingDefinition() :
                null // if not any of the above types
            );
            this.initialVersion = new VersionNumber(this.objects[0].version.toString());
            this.updateBreadcrumbs(this.objects, this.objectType);
        };
    }

    ngOnDestroy() {
        this.saveSubscription.unsubscribe();
        this.reloadSubscription.unsubscribe();
        this.routerEvents.unsubscribe();
    }

    private updateBreadcrumbs(result, objectType) {
        if (result.length == 0) {
            this.breadcrumbService.changeBreadcrumb(this.route.snapshot, "object not found")
            this.titleService.setTitle("object not found", true);
        } 
        else if ("name" in result[0] && result[0].name) {
            this.breadcrumbService.changeBreadcrumb(this.route.snapshot, result[0].name)
            this.titleService.setTitle(result[0].name, false);
        } 
        else if (objectType == 'marking-definition') {
            if ("definition_string" in result[0] && result[0].definition_string){
                this.breadcrumbService.changeBreadcrumb(this.route.snapshot, `marking definition`);
                this.titleService.setTitle(`Marking Definition`);
            }
            else {
                this.breadcrumbService.changeBreadcrumb(this.route.snapshot, `new ${objectType}`) 
                this.titleService.setTitle(`New Marking Definition`);
            }
        }
        else {
            this.breadcrumbService.changeBreadcrumb(this.route.snapshot, `new ${objectType}`)
            this.titleService.setTitle(`new ${objectType}`);
        }
    }
}

