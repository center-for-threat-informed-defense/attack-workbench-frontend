import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StixViewPage } from '../stix-view-page';
import { LogSource } from 'src/app/classes/stix';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-log-source-view',
  standalone: false,
  templateUrl: './log-source-view.component.html',
  styleUrl: './log-source-view.component.scss',
})
export class LogSourceViewComponent extends StixViewPage implements OnInit {
  @Output() public reload = new EventEmitter();

  public get logSource(): LogSource {
    return this.configCurrentObject as LogSource;
  }
  public get previous(): LogSource {
    return this.configPreviousObject as LogSource;
  }

  constructor(
    authenticationService: AuthenticationService,
    private apiService: RestApiConnectorService
  ) {
    super(authenticationService);
  }

  ngOnInit(): void {
    if (this.logSource.firstInitialized) {
      this.logSource.initializeWithDefaultMarkingDefinitions(this.apiService);
    }
  }
}
