import { Component, OnInit } from '@angular/core';
import { StixViewPage } from '../stix-view-page';
import { Analytic } from 'src/app/classes/stix';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-analytic-view',
  standalone: false,
  templateUrl: './analytic-view.component.html',
  styleUrl: './analytic-view.component.scss',
})
export class AnalyticViewComponent extends StixViewPage implements OnInit {
  public get analytic(): Analytic {
    return this.configCurrentObject as Analytic;
  }
  public get previous(): Analytic {
    return this.configPreviousObject as Analytic;
  }

  constructor(
    authenticationService: AuthenticationService,
    private apiService: RestApiConnectorService
  ) {
    super(authenticationService);
  }

  ngOnInit(): void {
    if (this.analytic.firstInitialized) {
      this.analytic.setDefaultMarkingDefinitions(this.apiService);
      this.generateAttackId();
    }
  }

  private generateAttackId(): void {
    this.apiService.getOrganizationNamespace().subscribe({
      next: namespaceSettings => {
        const prefix = namespaceSettings.prefix
          ? namespaceSettings.prefix + '-'
          : '';
        const range_start = namespaceSettings.range_start;

        // generate the ATT&CK ID
        const sub = this.analytic
          .getNamespaceID(this.apiService, {
            prefix,
            range_start,
          })
          .subscribe({
            next: val => {
              this.analytic.attackID = val;
              this.setNameFromAttackId();
            },
            complete: () => sub.unsubscribe(),
          });
      },
    });
  }

  public setNameFromAttackId(): void {
    if (this.analytic.attackID) {
      const regex = /\d+$/;
      const match = regex.exec(this.analytic.attackID);
      if (match) {
        this.analytic.name = `Analytic ${match[0]}`;
      }
    }
  }
}
