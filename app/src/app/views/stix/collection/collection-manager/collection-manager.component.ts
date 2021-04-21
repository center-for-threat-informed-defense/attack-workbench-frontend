import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Collection } from 'src/app/classes/stix/collection';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { CollectionIndexImportComponent } from '../collection-index/collection-index-import/collection-index-import.component';
import { CollectionIndexListComponent } from '../collection-index/collection-index-list/collection-index-list.component';

@Component({
  selector: 'app-collection-manager',
  templateUrl: './collection-manager.component.html',
  styleUrls: ['./collection-manager.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionManagerComponent implements OnInit {
    @ViewChild(CollectionIndexListComponent) private collectionIndexList: CollectionIndexListComponent;

    public collections: Collection[];

    constructor(private restAPIConnector: RestApiConnectorService) { }

    ngOnInit(): void {
        let subscription = this.restAPIConnector.getAllCollections({versions: "all"}).subscribe({
            next: (result) => {
                this.collections = result.data as Collection[];
            },
            complete: () => { subscription.unsubscribe(); }
        })
    }
}
