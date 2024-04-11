import { Component, OnInit } from '@angular/core';
import { DataSource } from 'src/app/classes/stix/data-source';
import { DataComponent } from 'src/app/classes/stix/data-component';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixViewPage } from '../../stix-view-page';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { StixDialogComponent } from '../../stix-dialog/stix-dialog.component';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { forkJoin } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Relationship } from 'src/app/classes/stix';

@Component({
    selector: 'app-data-source-view',
    templateUrl: './data-source-view.component.html',
    styleUrls: ['./data-source-view.component.scss']
})
export class DataSourceViewComponent extends StixViewPage implements OnInit {
    public get dataSource(): DataSource {
        return this.config.object as DataSource;
    }

    public dataComponents: DataComponent[];
    public techniquesDetected: Relationship[];
    public loading = false;

    constructor(public dialog: MatDialog, private restApiService: RestApiConnectorService, authenticationService: AuthenticationService) { super(authenticationService); }

    ngOnInit(): void {
        let dataSource = this.config.object as DataSource;
        if ( dataSource.firstInitialized ) {
            dataSource.initializeWithDefaultMarkingDefinitions(this.restApiService);
        }
        this.loadData();
    }

    public getDataComponents() {
        return this.restApiService.getAllDataComponents().pipe(
            // get related data components
            map(results => {
                let allComponents = results.data as DataComponent[];
                let components = allComponents.filter(c => c.dataSourceRef == this.dataSource.stixID);
                this.dataComponents = components;
                return components;
            }),
            // get techniques detected by data components
            concatMap(components => {
                let apiCalls = [];
                components.forEach(c =>
                    apiCalls.push(this.restApiService.getRelatedTo({
                        sourceRef: c.stixID,
                        relationshipType: 'detects',
                        targetType: 'technique',
                        includeDeprecated: true
                    }))
                );
                return forkJoin(apiCalls);
            }),
            // map pagination data to relationship list
            map((results: any) => {
                let relationshipData = results.map(r => r.data);
                let relationships = [];
                relationshipData.forEach(data => relationships.push(...data));
                this.techniquesDetected = relationships;
            })
        )
    }

    public loadData() {
        this.loading = true;
        let subscription = this.getDataComponents().subscribe({
            complete: () => {
                this.loading = false;
                if (subscription) subscription.unsubscribe();
            }
        })
    }

    public createDataComponent(): void {
        let data_component = new DataComponent();
        data_component.set_data_source_ref(this.dataSource);

        let prompt = this.dialog.open(StixDialogComponent, {
            data: {
                object: data_component,
                editable: true,
                mode: "edit",
                is_new: true,
                sidebarControl: "events"
            },
            maxHeight: "75vh",
			autoFocus: false,
        });
        let subscription = prompt.afterClosed().subscribe({
            next: (result) => {
                if (result) {
                    // re-fetch values since an edit occurred
                    this.loadData();
                }
            },
            complete: () => { subscription.unsubscribe(); }
        });
    }
}
