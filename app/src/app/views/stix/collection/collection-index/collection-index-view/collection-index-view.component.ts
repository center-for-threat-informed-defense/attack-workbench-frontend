import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { CollectionIndex } from 'src/app/classes/collection-index';
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

    constructor(private restAPIConnector: RestApiConnectorService) { }

    ngOnInit(): void {
    }

    public get showActions(): boolean {
        return !this.config.hasOwnProperty("show_actions") || this.config.show_actions;
    }

    public removeIndex() {
        // remove this collection index
        this.restAPIConnector.deleteCollectionIndex(this.config.index.id).subscribe(() => {
            this.onDelete.emit();
        });
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