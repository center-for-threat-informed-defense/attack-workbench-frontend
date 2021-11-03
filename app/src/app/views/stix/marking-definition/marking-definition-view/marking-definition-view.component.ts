import { Component, OnInit } from '@angular/core';
import { DataSource } from 'src/app/classes/stix/marking-definition';
import { DataComponent } from 'src/app/classes/stix/data-component';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixViewPage } from '../../stix-view-page';
import { MatDialog } from '@angular/material/dialog';
import { StixDialogComponent } from '../../stix-dialog/stix-dialog.component';

@Component({
    selector: 'app-marking-definition-view',
    templateUrl: './marking-definition-view.component.html',
    styleUrls: ['./marking-definition-view.component.scss']
})
export class MarkingDefinitionViewComponent extends StixViewPage implements OnInit {
    public get marking_definition(): DataSource { return this.config.object as DataSource; }
    public data_components: DataComponent[] = [];
    public loading = false;

    constructor(public dialog: MatDialog, private restAPIConnectorService: RestApiConnectorService) { super(); }

    ngOnInit(): void {
        this.data_components = this.marking_definition.data_components;
    }

    public getDataComponents(): void {
        this.loading = true;
        let data$ = this.restAPIConnectorService.getAllDataComponents();
        let sub = data$.subscribe({
            next: (results) => {
                let objects = results.data as DataComponent[];
                this.data_components = objects.filter(obj => obj.marking_definition_ref == this.marking_definition.stixID)
                this.loading = false;
            }, 
            complete: () => {sub.unsubscribe();}
        })
    }

    public createDataComponent(): void {
        let data_component = new DataComponent();
        data_component.marking_definition_ref = this.marking_definition.stixID;
        data_component.marking_definition = this.marking_definition;
        data_component.workflow = undefined;
        let prompt = this.dialog.open(StixDialogComponent, {
            data: {
                object: data_component,
                editable: true,
                mode: "edit",
                sidebarControl: "events"
            },
            maxHeight: "75vh"
        });
        let subscription = prompt.afterClosed().subscribe({
            next: (result) => {
                if (result) { this.getDataComponents(); } //re-fetch values since an edit occurred
            },
            complete: () => { subscription.unsubscribe(); }
        });
    }
}
