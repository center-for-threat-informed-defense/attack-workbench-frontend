import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Software } from 'src/app/classes/stix/software';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { StixViewPage } from '../stix-view-page';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-software-view',
  templateUrl: './software-view.component.html',
  styleUrls: ['./software-view.component.scss'],
  standalone: false,
})
export class SoftwareViewComponent extends StixViewPage implements OnInit {
  @Output() public onReload = new EventEmitter();
  public get software(): Software {
    return this.configCurrentObject as Software;
  }
  public get previous(): Software {
    return this.configPreviousObject as Software;
  }

  constructor(
    authenticationService: AuthenticationService,
    private restApiConnector: RestApiConnectorService
  ) {
    super(authenticationService);
  }

  ngOnInit() {
    if (this.software.firstInitialized) {
      this.software.setDefaultMarkingDefinitions(this.restApiConnector);
    }
  }
}
