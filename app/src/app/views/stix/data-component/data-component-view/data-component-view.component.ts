import { Component, OnInit } from '@angular/core';
import { DataComponent } from 'src/app/classes/stix/data-component';
import { DataSource } from 'src/app/classes/stix/data-source';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixViewPage } from '../../stix-view-page';

@Component({
    selector: 'app-data-component-view',
    templateUrl: './data-component-view.component.html',
    styleUrls: ['./data-component-view.component.scss']
})
export class DataComponentViewComponent extends StixViewPage implements OnInit {
    public get data_component() { return this.config.object as DataComponent; }

    constructor(private restAPIConnectorService: RestApiConnectorService) { super(); }

    ngOnInit(): void {
        // TODO retrieve parent data source
    }

}
