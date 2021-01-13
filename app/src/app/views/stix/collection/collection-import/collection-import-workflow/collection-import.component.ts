import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { Collection, CollectionImportCategories } from 'src/app/classes/stix/collection';
import { Group } from 'src/app/classes/stix/group';
import { Matrix } from 'src/app/classes/stix/matrix';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { Relationship } from 'src/app/classes/stix/relationship';
import { Software } from 'src/app/classes/stix/software';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-collection-import',
  templateUrl: './collection-import.component.html',
  styleUrls: ['./collection-import.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionImportComponent implements OnInit {
    @ViewChild(MatStepper) public stepper: MatStepper;

    public url: string = "";
    public loading_preview: boolean = false;

    public object_import_categories = {
        technique:    new CollectionImportCategories<Technique>(),
        tactic:       new CollectionImportCategories<Tactic>(),
        software:     new CollectionImportCategories<Software>(),
        relationship: new CollectionImportCategories<Relationship>(),
        mitigation:   new CollectionImportCategories<Mitigation>(),
        matrix:       new CollectionImportCategories<Matrix>(),
        group:        new CollectionImportCategories<Group>()
    }

    constructor(public route: ActivatedRoute, public http: HttpClient, public snackbar: MatSnackBar, public restAPIConnectorService: RestApiConnectorService) { }

    ngOnInit() {
        if (this.route.snapshot.queryParams["url"]) {
            // get URL
            this.url = decodeURIComponent(this.route.snapshot.queryParams["url"]);
            this.previewCollection();
        }
    }

    public previewCollection() {
        console.log("previewing collection:");
        console.log("1. fetching raw collection bundle")
        this.loading_preview = true;
        let subscription_getBundle = this.http.get(this.url).subscribe({ //get the raw collection bundle from the endpoint
            next: (collectionBundle) => {
                console.log("2. posting bundle to backend to get changelog preview")
                // send the collection bundle to the backend
                let subscription_preview = this.restAPIConnectorService.postCollectionBundle(collectionBundle, true).subscribe({
                    next: (preview_results) => {
                        console.log("3. parsing preview")
                        this.parsePreview(collectionBundle, preview_results)
                    },
                    complete: () => { subscription_preview.unsubscribe() }
                })
            },
            error: (err) => {
                console.error(err)
                this.snackbar.open(err.error, "dismiss", {
                    duration: 2000,
                    panelClass: "warn"
                })
            },
            complete: () => { subscription_getBundle.unsubscribe() } //prevent memory leaks
        })
    }

    public parsePreview(collectionBundle: any, preview: Collection) {
        let idToCategory = {};
        for (let category in preview.import_categories) {
            for (let stixId of preview.import_categories[category]) idToCategory[stixId] = category;
        }
        // console.log(idToCategory);
        for (let object of collectionBundle.objects) {
            // look up the category for the object
            let category = idToCategory[object.id];
            // wrap the object as if it came from the back-end
            let raw = {stix: object, workspace: {}};
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
                    this.object_import_categories.relationship[category].push(new Relationship(raw))
                break;
                case "course-of-action": //mitigation
                    // this.object_import_categories.mitigation[category].push(new Mitigation(raw))
                break;
                case "x-mitre-matrix": //matrix
                    // this.object_import_categories.matrix[category].push(new Matrix(raw))
                break;
                case "intrusion-set": //group
                    // this.object_import_categories.group[category].push(new Group(raw))
                break;
            }
        }
        console.log("4. done")
        
        this.stepper.next();

        this.loading_preview = false;
    }

}