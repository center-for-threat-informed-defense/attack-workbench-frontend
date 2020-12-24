import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CollectionIndex } from 'src/app/classes/collection-index';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-collection-index-view',
  templateUrl: './collection-index-view.component.html',
  styleUrls: ['./collection-index-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionIndexViewComponent implements OnInit {
    @Input() config: CollectionIndexViewConfig;
    @Output() onDelete = new EventEmitter();

    constructor(private restAPIConnector: RestApiConnectorService, private dialog: MatDialog) { }

    ngOnInit(): void {
    }

    public get showActions(): boolean {
        return !this.config.hasOwnProperty("show_actions") || this.config.show_actions;
    }

    public removeIndex() {
        // confirm that the user actually wants to do this
        let prompt = this.dialog.open(ConfirmationDialogComponent, {
            maxWidth: "35em",
            data: { 
                message: "Are you sure you want to remove the collection index?",
                yes_suffix: "delete it"
            }
        });
        prompt.afterClosed().subscribe(result => {
            // if they clicked yes, delete the index
            if (result) this.restAPIConnector.deleteCollectionIndex(this.config.index.id).subscribe(() => {
                this.onDelete.emit();
            });
        })
    }


}
export interface CollectionIndexViewConfig {
    // the index to show
    index: CollectionIndex;
    // default false. If true, show the collection title in the component
    show_title: boolean;
    // default true. If false, hides subscribe actions from the component
    show_actions: boolean;
}