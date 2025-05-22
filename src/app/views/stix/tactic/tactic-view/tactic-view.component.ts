import { Component, OnInit } from '@angular/core';
import { Tactic } from 'src/app/classes/stix/tactic';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { StixViewPage } from '../../stix-view-page';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-tactic-view',
  templateUrl: './tactic-view.component.html',
  styleUrls: ['./tactic-view.component.scss'],
  standalone: false,
})
export class TacticViewComponent extends StixViewPage implements OnInit {
  public loading = false;
  public get tactic(): Tactic {
    return this.configCurrentObject as Tactic;
  }
  public get previous(): Tactic | null {
    return this.configPreviousObject as Tactic;
  }
  public techniques: StixObject[] = [];

  constructor(
    authenticationService: AuthenticationService,
    private restApiConnector: RestApiConnectorService
  ) {
    super(authenticationService);
  }

  ngOnInit() {
    if (this.tactic.firstInitialized) {
      this.tactic.initializeWithDefaultMarkingDefinitions(
        this.restApiConnector
      );
    } else {
      this.getTechniques();
    }
  }

  /**
   * Get techniques under this tactic
   */
  public getTechniques(): void {
    this.loading = true;
    const data$: any = this.restApiConnector.getTechniquesInTactic(
      this.tactic.stixID,
      this.tactic.modified
    );
    const subscription = data$.subscribe({
      next: result => {
        this.techniques = result;
        this.loading = false;
      },
      complete: () => {
        subscription.unsubscribe();
      },
    });
  }
}
