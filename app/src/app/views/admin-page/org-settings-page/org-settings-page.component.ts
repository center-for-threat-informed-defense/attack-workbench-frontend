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
    public idRegex = `^([A-Za-z])*$`;
    public rangeRegex = `^([0-9]){1,4}$`;

    public isNOU = (x) => x === undefined || x === null; // isNullOrUndefined

    public get isNamespaceInvalid(): boolean {
      const regid = new RegExp(this.idRegex);
      const regrange = new RegExp(this.rangeRegex);
      return (this.organizationNamespace.prefix === '' && this.isNOU(this.organizationNamespace.range_start)) ||
              (!regid.test(this.organizationNamespace.prefix)) ||
              (!this.isNOU(this.organizationNamespace.range_start) && !regrange.test(this.organizationNamespace.range_start?.toString()));
    }

    constructor(private restAPIConnector: RestApiConnectorService) { }

    ngOnInit(): void {
        const idSub = this.restAPIConnector.getOrganizationIdentity().subscribe({
            next: (identity) => this.organizationIdentity = identity,
            complete: () => idSub.unsubscribe()
        });

        const namespaceSub = this.restAPIConnector.getOrganizationNamespace().subscribe({
            next: (namespaceSettings) => {
              this.organizationNamespace = {
                ...namespaceSettings,
                range_start: namespaceSettings.range_start ? namespaceSettings.range_start.toString().padStart(4, '0') : undefined
              };
            },
            complete: () => namespaceSub.unsubscribe()
        });

    }

    onBlur(): void {
      if (!this.isNOU(this.organizationNamespace.range_start)) {
        this.organizationNamespace.range_start = this.organizationNamespace.range_start.toString().padStart(4, '0');
      }
    }

    saveIdentity(): void {
        const subscription = this.restAPIConnector.postIdentity(this.organizationIdentity).subscribe({
            next: (identity) => this.organizationIdentity = identity,
            complete: () => subscription.unsubscribe()
        });
    }

    saveNamespace(): void {
        const subscription = this.restAPIConnector.setOrganizationNamespace(this.organizationNamespace).subscribe({
            next: (namespace) => this.organizationNamespace = namespace,
            complete: () => subscription.unsubscribe()
        });
    }

}
