import { Component, OnInit } from '@angular/core';
import { Identity } from 'src/app/classes/stix/identity';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-org-identity-page',
  templateUrl: './org-identity-page.component.html',
  styleUrls: ['./org-identity-page.component.scss']
})
export class OrgIdentityPageComponent implements OnInit {
    public organizationIdentity: Identity;

    constructor(private restAPIConnector: RestApiConnectorService) { }

    ngOnInit(): void {
        let subscription = this.restAPIConnector.getOrganizationIdentity().subscribe({
            next: (identity) => this.organizationIdentity = identity,
            complete: () => subscription.unsubscribe()
        });
    }

    saveIdentity() {
        let subscription = this.restAPIConnector.postIdentity(this.organizationIdentity).subscribe({
            next: (identity) => this.organizationIdentity = identity,
            complete: () => subscription.unsubscribe()
        });
    }

}
