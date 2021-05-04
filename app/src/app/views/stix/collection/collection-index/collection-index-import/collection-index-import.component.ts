import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { CollectionIndex } from 'src/app/classes/collection-index';
import { CollectionManagerConnectorService } from 'src/app/services/connectors/collection-manager/collection-manager-connector.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "../../../../../../environments/environment";
import { logger } from "../../../../../util/logger";
@Component({
  selector: 'app-collection-index-import',
  templateUrl: './collection-index-import.component.html',
  styleUrls: ['./collection-index-import.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionIndexImportComponent implements OnInit {
    @ViewChild(MatStepper) public stepper: MatStepper;

    constructor(private collectionManagerConnector: CollectionManagerConnectorService, 
                private restAPIConnector: RestApiConnectorService, 
                private snackbar: MatSnackBar) { }

    ngOnInit(): void {}

    public url: string = "";
    public get recommended_indexes() { return environment.recommended_indexes; }

    public index: CollectionIndex = null;

    /**
     * download the collection index at this.url and move to the next step in the stepper
     */
    public previewIndex(): void {
        // TODO interact with collection manager to trigger download process
        let subscription = this.collectionManagerConnector.getRemoteIndex(this.url).subscribe({
            next: (index) => {
                this.index = new CollectionIndex(index);
                if (this.index.valid()) { this.stepper.next(); }
                else { this.error("Invalid collection index.") } //show snackbar
            },
            complete: () => { subscription.unsubscribe(); } //prevent memory leaks
        })
    }
    /**
     * Save the downloaded collection index to the REST API
     *
    * @memberof CollectionIndexImportComponent
     */
    public saveIndex(): void {
        let serialized = this.index.serialize();
        serialized.workspace.update_policy = { // set up update policy
            automatic: true,
            last_retrieval: new Date(),
            interval: 10,
        }
        let subscription = this.restAPIConnector.postCollectionIndex(serialized).subscribe({
            next: (result) => {
                this.stepper.next();
            },
            complete: () => { subscription.unsubscribe(); } // prevent memory leaks
        })
    }

    /**
     * Show error message
     * @param {msg} message the error message to show
     */
    public error(msg: string): void {
        logger.error(msg);
        this.snackbar.open(msg, "dismiss", {
            duration: 2000,
            panelClass: "warn"
        })
    }
}