import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { Role } from 'src/app/classes/authn/role';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class DashboardPageComponent implements OnInit {
  public pendingUsers;

  constructor(
    private restApiConnector: RestApiConnectorService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    const userSubscription = this.restApiConnector
      .getAllUserAccounts({ status: ['pending'] })
      .subscribe({
        next: results => {
          const users = results as any;
          if (users && users.length) this.pendingUsers = users.length;
        },
        complete: () => userSubscription.unsubscribe(),
      });
  }

  public get isAdmin(): boolean {
    return this.authenticationService.isAuthorized([Role.ADMIN]);
  }

  public get isTeamLead(): boolean {
    return this.authenticationService.isAuthorized([Role.TEAM_LEAD]);
  }
}