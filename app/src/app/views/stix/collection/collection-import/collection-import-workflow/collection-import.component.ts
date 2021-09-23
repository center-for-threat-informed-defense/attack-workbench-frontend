import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { FileInputComponent } from 'ngx-material-file-input';
import { Collection, CollectionDiffCategories } from 'src/app/classes/stix/collection';
import { Group } from 'src/app/classes/stix/group';
import { Matrix } from 'src/app/classes/stix/matrix';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { Relationship } from 'src/app/classes/stix/relationship';
import { Software } from 'src/app/classes/stix/software';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { logger } from "../../../../../util/logger";

@Component({
  selector: 'app-collection-import',
  templateUrl: './collection-import.component.html',
  styleUrls: ['./collection-import.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionImportComponent implements OnInit {
    @ViewChild(MatStepper) public stepper: MatStepper;
    @ViewChild(FileInputComponent) public fileInput: FileInputComponent;

    public url: string = "";
    public loadingStep1: boolean = false;
    public loadingStep2: boolean = false;
    public select: SelectionModel<string>;
    // ids of objects which have changed (object-version not already in knowledge base)
    public changed_ids: string[] = [];
    // ids of objects which have nto changed (object-version not already in knowledge base)
    public unchanged_ids: string[] = [];
    public save_errors: string[] = [];
    public successfully_saved: Set<string> = new Set();
    public collectionBundle: any;

    public object_import_categories = {
        technique:    new CollectionDiffCategories<Technique>(),
        tactic:       new CollectionDiffCategories<Tactic>(),
        software:     new CollectionDiffCategories<Software>(),
        relationship: new CollectionDiffCategories<Relationship>(),
        mitigation:   new CollectionDiffCategories<Mitigation>(),
        matrix:       new CollectionDiffCategories<Matrix>(),
        group:        new CollectionDiffCategories<Group>()
    }

    constructor(public route: ActivatedRoute, public http: HttpClient, public snackbar: MatSnackBar, public restAPIConnectorService: RestApiConnectorService, private dialog: MatDialog) { }

    ngOnInit() {
        if (this.route.snapshot.queryParams["url"]) {
            // get URL
            this.url = decodeURIComponent(this.route.snapshot.queryParams["url"]);
            this.getCollectionFromURL();
        }
    }

    public getCollectionFromFile() {
        this.loadingStep1 = true;
        let reader = new FileReader();
        reader.onload = (e) => {
            let str = String(reader.result);
            try {
                let collectionBundle = JSON.parse(str);
                this.previewCollection(collectionBundle);
            } catch (exception) {
                this.snackbar.open(exception.message, "dismiss", {
                    duration: 2000,
                    panelClass: "warn"
                })
                this.loadingStep1 = false;
            }
        }
        reader.readAsText(this.fileInput.value.files[0]);
    }

    public getCollectionFromURL() {
        this.loadingStep1 = true;
        let subscription_getBundle = this.http.get(this.url).subscribe({ //get the raw collection bundle from the endpoint
            next: (collectionBundle) => this.previewCollection(collectionBundle),
            error: (err) => {
                logger.error(err)
                this.snackbar.open(err.message, "dismiss", {
                    duration: 2000,
                    panelClass: "warn"
                })
                this.loadingStep1 = false;
            },
            complete: () => { subscription_getBundle.unsubscribe() } //prevent memory leaks
        })
    }

    public previewCollection(collectionBundle) {
        // send the collection bundle to the backend
        let subscription_preview = this.restAPIConnectorService.postCollectionBundle(collectionBundle, true).subscribe({
            next: (preview_results) => {
                if (!preview_results) {
                    this.loadingStep1 = false;  
                } else {
                    this.parsePreview(collectionBundle, preview_results)
                }
            },
            error: (err) => {
                this.loadingStep1 = false;
            },
            complete: () => { subscription_preview.unsubscribe() }
        })
    }

    public parsePreview(collectionBundle: any, preview: Collection) {
        this.collectionBundle = collectionBundle; //save for later
        
        //build ID to category lookup
        let idToCategory = {};

        for (let category in preview.import_categories) {
            for (let stixId of preview.import_categories[category]) idToCategory[stixId] = category;
        }
        //build ID to name lookup
        let idToSdo = {};
        for (let object of collectionBundle.objects) {
            if ("id" in object) idToSdo[object.id] = {stix: object}
        }

        for (let object of collectionBundle.objects) {
            // look up the category for the object
            if (!(object.id in idToCategory)) {
                // does not belong to a change category
                this.unchanged_ids.push(object.id);
                continue;
            }
            // track that this object has changed
            this.changed_ids.push(object.id); 
            // determine the change category
            let category = idToCategory[object.id];
            // wrap the object as if it came from the back-end
            let raw: {[key: string]: any} = {stix: object, workspace: {}};
            // parse the object & add it to the appropriate category for rendering
            switch (object.type) {
                case "attack-pattern": //technique
                    this.object_import_categories.technique[category].push(new Technique(raw))
                break;
                case "x-mitre-tactic": //tactic
                    this.object_import_categories.tactic[category].push(new Tactic(raw))
                break;
                case "malware": //software
                case "tool": 
                    this.object_import_categories.software[category].push(new Software(object.type, raw))
                break;
                case "relationship": //relationship
                    if (object.source_ref in idToSdo) raw.source_object = idToSdo[object.source_ref]
                    if (object.target_ref in idToSdo) raw.target_object = idToSdo[object.target_ref]
                    let rel = new Relationship(raw)
                    this.object_import_categories.relationship[category].push(rel)
                break;
                case "course-of-action": //mitigation
                    this.object_import_categories.mitigation[category].push(new Mitigation(raw))
                break;
                case "x-mitre-matrix": //matrix
                    this.object_import_categories.matrix[category].push(new Matrix(raw))
                break;
                case "intrusion-set": //group
                    this.object_import_categories.group[category].push(new Group(raw))
                break;
            }
        }
        // set up selection
        this.select =  new SelectionModel(true, this.changed_ids);
        
        this.stepper.next();
    }

    /**
     * Select all objects for import
     */
    public selectAll() {
        for (let id of this.changed_ids) this.select.select(id);
    }
    
    /**
     * deselect all objects for import
     */
    public deselectAll() {
        this.select.clear()
    }

    /**
     * Perform the import of the collection
     */
    public import() {
        let prompt = this.dialog.open(ConfirmationDialogComponent, {
            maxWidth: "25em",
            data: {
                message: `Are you sure you want to import ${this.select.selected.length} objects?`,
                yes_suffix: "import the collection"
            }
        })
        let promptSubscription = prompt.afterClosed().subscribe({
            next: (result) => {
                if (result) {
                    // filter bundle for objects that were not selected
                    this.loadingStep2 = true;
                    setTimeout(() => { //make sure the loading icon renders before the parsing/writing
                        let newBundle = JSON.parse(JSON.stringify(this.collectionBundle)); //deep copy
                        let objects = []
                        // filter objects to selected or unchanged
                        for (let object of newBundle.objects) {
                            if (this.unchanged_ids.includes(object.id) || this.select.selected.includes(object.id)) {
                                // object is selected or unchanged
                                objects.push(object);
                            }
                        }
                        newBundle.objects = objects;
                        let subscription = this.restAPIConnectorService.postCollectionBundle(newBundle, false).subscribe({
                            next: (results) => { 
                                if (results.import_categories.errors.length > 0) {
                                    logger.warn("Collection import completed with errors:", results.import_categories.errors);
                                }
                                this.save_errors = results.import_categories.errors.filter(err => err["error_type"] == "Save error");
                                let save_error_ids = new Set(this.save_errors.map(err => err['object_ref']));
                                for (let category in results.import_categories) {
                                    if (category == "errors") continue;
                                    for (let id of results.import_categories[category]) if (!save_error_ids.has(id)) this.successfully_saved.add(id);
                                }
                                logger.log("Successfully imported the following objects:", Array.from(this.successfully_saved));
                                this.stepper.next(); 
                            },
                            complete: () => { subscription.unsubscribe(); } //prevent memory leaks
                        })
                    })
                }
            },
            complete: () => { promptSubscription.unsubscribe() } //prevent memory leaks
        })
    }

    /**
     * Download a log of errors from the import
     */
    public downloadErrorLog() {
        this.restAPIConnectorService.triggerBrowserDownload(this.save_errors, "import-errors.json")
    }

}