import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { CollectionIndex } from 'src/app/classes/collection-index';
import { CollectionManagerConnectorService } from 'src/app/services/connectors/collection-manager/collection-manager-connector.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-collection-index-import',
  templateUrl: './collection-index-import.component.html',
  styleUrls: ['./collection-index-import.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionIndexImportComponent implements OnInit {
    @ViewChild(MatStepper) public stepper: MatStepper;

    constructor(public dialogRef: MatDialogRef<CollectionIndexImportComponent>, 
                private collectionManagerConnector: CollectionManagerConnectorService, 
                private restAPIConnector: RestApiConnectorService, 
                private snackbar: MatSnackBar) { }

    ngOnInit(): void {
    }

    public url: string = "";

    public index: CollectionIndex = null;

    /**
     * download the collection index at this.url and move to the next step in the stepper
     */
    public downloadIndex(): void {
        console.log("trigger download");
        // TODO interact with collection manager to trigger download process
        this.collectionManagerConnector.getRemoteIndex(this.url).subscribe((index) => {
            console.log("done");
            this.index = new CollectionIndex(index);
            if (this.index.valid()) { this.stepper.next(); }
            else { this.error("Invalid collection index.") } //show snackbar
        })
    }
    /**
     * Save the downloaded collection index to the REST API
     *
     * @memberof CollectionIndexImportComponent
     */
    public saveIndex(): void {
        this.restAPIConnector.postCollectionIndex(this.index).subscribe(result => {
            this.stepper.next();
        })
    }

    /**
     * Show error message
     * @param {msg} message the error message to show
     */
    public error(msg: string): void {
        console.error(msg);
        this.snackbar.open(msg, "dismiss", {
            duration: 2000,
            panelClass: "warn"
        })
    }
}