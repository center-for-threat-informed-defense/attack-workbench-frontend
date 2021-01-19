import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { CollectionIndex } from 'src/app/classes/collection-index';
import { CollectionManagerConnectorService } from 'src/app/services/connectors/collection-manager/collection-manager-connector.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-collection-index-import',
  templateUrl: './collection-index-import.component.html',
  styleUrls: ['./collection-index-import.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionIndexImportComponent implements OnInit {
    @ViewChild(MatStepper) public stepper: MatStepper;

    constructor(private collectionManagerConnector: CollectionManagerConnectorService, private restAPIConnector: RestApiConnectorService) { }

    ngOnInit(): void {
    }

    public url: string = "";

    public index: CollectionIndex = null;

    /**
     * download the collection index at this.url and move to the next step in the stepper
     */
    public previewIndex(): void {
        // console.log("trigger download");
        // TODO interact with collection manager to trigger download process
        let subscription = this.collectionManagerConnector.getRemoteIndex(this.url).subscribe({
            next: (index) => {
                console.log("done");
                this.index = index;
                this.stepper.next();
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
        let subscription = this.restAPIConnector.postCollectionIndex(this.index).subscribe({
            next: (result) => {
                this.stepper.next();
            },
            complete: () => { subscription.unsubscribe(); } // prevent memory leaks
        })
    }

}