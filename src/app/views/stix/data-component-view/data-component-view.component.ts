import { Component, OnInit } from '@angular/core';
import { DataComponent } from 'src/app/classes/stix/data-component';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixViewPage } from '../stix-view-page';

@Component({
  selector: 'app-data-component-view',
  templateUrl: './data-component-view.component.html',
  standalone: false,
})
export class DataComponentViewComponent extends StixViewPage implements OnInit {
  // used to conditionally show/hide data component relationships with techniques
  public showTechniques = false;

  public get dataComponent(): DataComponent {
    return this.configCurrentObject as DataComponent;
  }
  public get previous(): DataComponent {
    return this.configPreviousObject as DataComponent;
  }

  constructor(
    private restAPIConnectorService: RestApiConnectorService,
    authenticationService: AuthenticationService
  ) {
    super(authenticationService);
  }

  ngOnInit(): void {
    if (this.dataComponent.firstInitialized) {
      this.dataComponent.initializeWithDefaultMarkingDefinitions(
        this.restAPIConnectorService
      );
    }
  }
}
