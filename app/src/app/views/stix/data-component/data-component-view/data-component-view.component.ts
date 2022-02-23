import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataComponent } from 'src/app/classes/stix/data-component';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixViewPage } from '../../stix-view-page';

@Component({
    selector: 'app-data-component-view',
    templateUrl: './data-component-view.component.html'
})
export class DataComponentViewComponent extends StixViewPage implements OnInit {
    @Output() onClickRelationship = new EventEmitter();
    public loading = false;
    public get data_component(): DataComponent {
        return this.config.object as DataComponent; 
    }

    constructor(private restAPIConnectorService: RestApiConnectorService) { super(); }

    ngOnInit(): void {
        if (!this.data_component.data_source) {
            // fetch parent data source
            this.loading = true;
            let objects$ = this.restAPIConnectorService.getDataComponent(this.data_component.stixID);
            let subscription = objects$.subscribe({
                next: (result) => {
                    let objects = result as DataComponent[];
                    this.data_component.data_source = objects[0].data_source;
                    this.loading = false;
                },
                complete: () => { subscription.unsubscribe(); }
            });
        }
        let data_component = this.config.object as DataComponent;
        if ( data_component.firstInitialized ) {
            data_component.initializeWithDefaultMarkingDefinitions(this.restAPIConnectorService)
        }
    }

    public viewRelationship(object: StixObject): void {
        this.onClickRelationship.emit(object);
    }
}
