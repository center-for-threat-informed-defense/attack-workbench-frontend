import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Identity } from 'src/app/classes/stix/identity';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { AuthenticationService } from '../../../services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from '../../../services/connectors/rest-api/rest-api-connector.service';
import { Subscription } from 'rxjs';
import { UserAccount } from 'src/app/classes/authn/user-account';

@Component({
  selector: 'app-identity-property',
  templateUrl: './identity-property.component.html',
  styleUrls: ['./identity-property.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class IdentityPropertyComponent implements OnInit {
  @Input() public config: IdentityPropertyConfig;

  public identity: Identity;
  private userSubscription$: Subscription;

  constructor(
    private authenticationService: AuthenticationService,
    private restAPIConnector: RestApiConnectorService
  ) {}

  ngOnInit(): void {
    const object = Array.isArray(this.config.object)
      ? this.config.object[0]
      : this.config.object;

    if (object[this.config.field])
      this.identity = object[this.config.field] as Identity;

    // if logged in, show individual user attribution
    if (
      this.authenticationService.isLoggedIn &&
      this.config.field.includes('modified') &&
      object?.['workflow']?.['created_by_user_account']
    ) {
      const userID = object.workflow.created_by_user_account;
      this.userSubscription$ = this.restAPIConnector
        .getUserAccount(userID)
        .subscribe({
          next: account => {
            const user = new UserAccount(account);
            if (!this.identity) this.identity = new Identity();
            this.identity.name = user.displayName;
          },
          complete: () => this.userSubscription$.unsubscribe(),
        });
    }
  }
}

export interface IdentityPropertyConfig {
  /* The object to show the identity field of */
  object: StixObject | [StixObject, StixObject];
  /* Field of object to be displayed */
  field: string;
  /* Show identity name? If true, display the identity name next to its icon. Defaults to False */
  displayName?: boolean;
  /* Field of the timestamp to be displayed. Defaults to none */
  timeField?: string;
}
