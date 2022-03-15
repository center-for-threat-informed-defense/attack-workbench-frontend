import { Component, OnInit } from '@angular/core';
import { Identity } from 'src/app/classes/stix/identity';
import { Namespace, RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-org-settings-page',
  templateUrl: './org-settings-page.component.html',
  styleUrls: ['./org-settings-page.component.scss']
})
export class OrgSettingsPageComponent implements OnInit {
    public organizationIdentity: Identity;
    public organizationNamespace: Namespace;
    public idRegex = `^([A-Za-z])+$`;
    public rangeRegex = `^([0-9]){0,4}$`;
    public get isNamespaceInvalid(): boolean {
      const regid = new RegExp(this.idRegex);
      const regrange = new RegExp(this.rangeRegex);
      return !regid.test(this.organizationNamespace.prefix) || !regrange.test(this.organizationNamespace.range_start?.toString());
    }

    constructor(private restAPIConnector: RestApiConnectorService) { }

    ngOnInit(): void {
        let idSub = this.restAPIConnector.getOrganizationIdentity().subscribe({
            next: (identity) => this.organizationIdentity = identity,
            complete: () => idSub.unsubscribe()
        });

        let namespaceSub = this.restAPIConnector.getOrganizationNamespace().subscribe({
            next: (namespaceSettings) => this.organizationNamespace = namespaceSettings,
            complete: () => namespaceSub.unsubscribe()
        })

    }

    saveIdentity() {
        let subscription = this.restAPIConnector.postIdentity(this.organizationIdentity).subscribe({
            next: (identity) => this.organizationIdentity = identity,
            complete: () => subscription.unsubscribe()
        });
    }

    saveNamespace() {
        if (!this.organizationNamespace.range_start) this.organizationNamespace.range_start = 0; // must send number to api call
        let subscription = this.restAPIConnector.setOrganizationNamespace(this.organizationNamespace).subscribe({
            next: (namespace) => this.organizationNamespace = namespace,
            complete: () => subscription.unsubscribe()
        });
    }

}
