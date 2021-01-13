import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Collection } from 'src/app/classes/stix/collection';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-collection-import',
  templateUrl: './collection-import.component.html',
  styleUrls: ['./collection-import.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionImportComponent implements OnInit {

    public url: string = "";
    public loading_preview: boolean = false;

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
        console.log(collectionBundle, preview)
        
        console.log("4. done")
        this.loading_preview = false;
    }

}