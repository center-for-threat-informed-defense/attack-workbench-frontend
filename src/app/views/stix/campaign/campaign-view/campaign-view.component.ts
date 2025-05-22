import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Campaign } from 'src/app/classes/stix/campaign';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixViewPage } from '../../stix-view-page';

@Component({
  selector: 'app-campaign-view',
  templateUrl: './campaign-view.component.html',
  styleUrls: ['./campaign-view.component.scss'],
  standalone: false,
})
export class CampaignViewComponent extends StixViewPage implements OnInit {
  @Output() public onReload = new EventEmitter();
  public get campaign(): Campaign {
    return this.configCurrentObject as Campaign;
  }
  public get previous(): Campaign {
    return this.configPreviousObject as Campaign;
  }

  constructor(
    authenticationService: AuthenticationService,
    private restApiConnector: RestApiConnectorService
  ) {
    super(authenticationService);
  }

  ngOnInit(): void {
    if (this.campaign.firstInitialized) {
      this.campaign.initializeWithDefaultMarkingDefinitions(
        this.restApiConnector
      );
    }
  }
}
