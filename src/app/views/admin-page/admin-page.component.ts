import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class AdminPageComponent implements OnInit {
  public pendingUsers;

  constructor(private restApiConnector: RestApiConnectorService) {}

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
}
