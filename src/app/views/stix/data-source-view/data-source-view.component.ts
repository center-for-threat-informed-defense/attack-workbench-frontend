import { Component, OnInit } from '@angular/core';
import { DataSource } from 'src/app/classes/stix/data-source';
import { DataComponent } from 'src/app/classes/stix/data-component';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixViewPage } from '../stix-view-page';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { forkJoin, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Relationship } from 'src/app/classes/stix';

@Component({
  selector: 'app-data-source-view',
  templateUrl: './data-source-view.component.html',
  styleUrls: ['./data-source-view.component.scss'],
  standalone: false,
})
export class DataSourceViewComponent extends StixViewPage implements OnInit {
  public get dataSource(): DataSource {
    return this.configCurrentObject as DataSource;
  }
  public get previous(): DataSource {
    return this.configPreviousObject as DataSource;
  }

  public dataComponents: DataComponent[];
  public techniquesDetected: Relationship[];
  public loading = false;

  constructor(
    public dialog: MatDialog,
    private restApiService: RestApiConnectorService,
    authenticationService: AuthenticationService
  ) {
    super(authenticationService);
  }

  ngOnInit(): void {
    if (this.dataSource.firstInitialized) {
      this.dataSource.setDefaultMarkingDefinitions(this.restApiService);
    }
    this.loadData();
  }

  public getDataComponents() {
    return this.restApiService
      .getAllDataComponents({ includeDeprecated: true })
      .pipe(
        // get related data components
        map(results => {
          const allComponents = results.data as DataComponent[];
          const components = allComponents.filter(
            c => c?.dataSourceRef == this.dataSource.stixID
          );
          this.dataComponents = components;
          return components;
        }),
        // get techniques detected by data components
        concatMap(components => {
          const apiCalls = [];
          components.forEach(c =>
            apiCalls.push(
              this.restApiService.getRelatedTo({
                sourceRef: c.stixID,
                relationshipType: 'detects',
                targetType: 'technique',
                includeDeprecated: true,
              })
            )
          );
          if (apiCalls.length) return forkJoin(apiCalls);
          else return of([]);
        }),
        // map pagination data to relationship list
        map((results: any) => {
          const relationshipData = results.map(r => r.data);
          const relationships = [];
          relationshipData.forEach(data => relationships.push(...data));
          this.techniquesDetected = relationships;
        })
      );
  }

  public loadData() {
    this.loading = true;
    const subscription = this.getDataComponents().subscribe({
      complete: () => {
        this.loading = false;
        if (subscription) subscription.unsubscribe();
      },
    });
  }
}
