import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Role } from 'src/app/classes/authn/role';
import { Collection } from 'src/app/classes/stix/collection';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { CollectionIndexListComponent } from '../collection-index/collection-index-list/collection-index-list.component';

@Component({
  selector: 'app-collection-manager',
  templateUrl: './collection-manager.component.html',
  styleUrls: ['./collection-manager.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionManagerComponent implements OnInit {
    @ViewChild(CollectionIndexListComponent) private collectionIndexList: CollectionIndexListComponent;
    public get isAdmin(): boolean { return this.authenticationService.isAuthorized([Role.Admin]); }

    public collections: Collection[];

    constructor(private restAPIConnector: RestApiConnectorService, private authenticationService: AuthenticationService) { }

    ngOnInit(): void {
        let subscription = this.restAPIConnector.getAllCollections({versions: "all"}).subscribe({
            next: (result) => {
                this.collections = result.data as Collection[];
            },
            complete: () => { subscription.unsubscribe(); }
        })
    }
}
