import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataComponent } from 'src/app/classes/stix/data-component';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixViewPage } from '../../stix-view-page';

@Component({
  selector: 'app-data-component-view',
  templateUrl: './data-component-view.component.html',
  standalone: false,
})
export class DataComponentViewComponent extends StixViewPage implements OnInit {
  @Output() onClickRelationship = new EventEmitter();
  public loading = false;
  public get dataComponent(): DataComponent {
    return this.configCurrentObject as DataComponent;
  }
  public get previous(): DataComponent {
    return this.configPreviousObject as DataComponent;
  }

  constructor(
    private restAPIConnectorService: RestApiConnectorService,
    authenticationService: AuthenticationService
  ) {
    super(authenticationService);
  }

  ngOnInit(): void {
    if (!this.dataComponent.data_source) {
      // fetch parent data source
      this.loading = true;
      const objects$ = this.restAPIConnectorService.getDataComponent(
        this.dataComponent.stixID
      );
      const subscription = objects$.subscribe({
        next: result => {
          const objects = result as DataComponent[];
          this.dataComponent.data_source = objects[0].data_source;
          this.loading = false;
        },
        complete: () => {
          subscription.unsubscribe();
        },
      });
    }
    if (this.dataComponent.firstInitialized) {
      this.dataComponent.initializeWithDefaultMarkingDefinitions(
        this.restAPIConnectorService
      );
    }
  }

  public viewRelationship(object: StixObject): void {
    this.onClickRelationship.emit(object);
  }
}
