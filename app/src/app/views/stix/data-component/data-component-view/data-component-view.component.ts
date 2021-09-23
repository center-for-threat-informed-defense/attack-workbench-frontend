import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataComponent } from 'src/app/classes/stix/data-component';
import { DataSource } from 'src/app/classes/stix/data-source';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixViewPage } from '../../stix-view-page';

@Component({
    selector: 'app-data-component-view',
    templateUrl: './data-component-view.component.html',
    styleUrls: ['./data-component-view.component.scss']
})
export class DataComponentViewComponent extends StixViewPage implements OnInit {
    @Output() onClickRelationship = new EventEmitter();

    public get data_component() { return this.config.object as DataComponent; }
    public data_source: DataSource = null;

    constructor(private restAPIConnectorService: RestApiConnectorService) { super(); }

    ngOnInit(): void {
        // retrieve parent data source
        let objects$ = this.restAPIConnectorService.getDataSource(this.data_component.data_source_ref);
        let subscription = objects$.subscribe({
            next: (result) => {
                let objects = result as DataSource[];
                this.data_source = objects[0];
            },
            complete: () => { subscription.unsubscribe() }
        });
    }

    public viewRelationship(object: StixObject): void {
        this.onClickRelationship.emit(object);
    }
}
