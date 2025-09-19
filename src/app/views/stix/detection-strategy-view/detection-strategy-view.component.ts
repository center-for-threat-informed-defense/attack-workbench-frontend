import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StixViewPage } from '../stix-view-page';
import { DetectionStrategy, StixObject } from 'src/app/classes/stix';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-detection-strategy-view',
  standalone: false,
  templateUrl: './detection-strategy-view.component.html',
  styleUrl: './detection-strategy-view.component.scss',
})
export class DetectionStrategyViewComponent
  extends StixViewPage
  implements OnInit
{
  @Output() public reload = new EventEmitter();

  public analytics: StixObject[] = [];
  public loading = false;

  public get detectionStrategy(): DetectionStrategy {
    return this.configCurrentObject as DetectionStrategy;
  }
  public get previous(): DetectionStrategy | null {
    return this.configPreviousObject as DetectionStrategy;
  }

  constructor(
    authenticationService: AuthenticationService,
    private apiService: RestApiConnectorService
  ) {
    super(authenticationService);
  }

  ngOnInit(): void {
    if (this.detectionStrategy.firstInitialized) {
      this.detectionStrategy.setDefaultMarkingDefinitions(this.apiService);
    }

    this.loading = true;
    const subscription = this.apiService.getAllAnalytics().subscribe({
      next: result => {
        this.analytics = result.data || [];
        this.loading = false;
      },
      complete: () => subscription.unsubscribe(),
    });
  }
}
