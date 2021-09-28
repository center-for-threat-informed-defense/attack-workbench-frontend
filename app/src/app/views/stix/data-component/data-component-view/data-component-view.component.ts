import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataComponent } from 'src/app/classes/stix/data-component';
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
    public loading = false;
    public data_component: DataComponent;

    constructor(private restAPIConnectorService: RestApiConnectorService) { super(); }

    ngOnInit(): void {
        this.loading = true;
        let object = Array.isArray(this.config.object)? this.config.object[0] : this.config.object;
        let objects$ = this.restAPIConnectorService.getDataComponent(object.stixID);
        let subscription = objects$.subscribe({
            next: (result) => {
                let objects = result as DataComponent[];
                this.data_component = objects[0];
                this.loading = false;
            },
            complete: () => { subscription.unsubscribe(); }
        });
    }

    public viewRelationship(object: StixObject): void {
        this.onClickRelationship.emit(object);
    }
}
