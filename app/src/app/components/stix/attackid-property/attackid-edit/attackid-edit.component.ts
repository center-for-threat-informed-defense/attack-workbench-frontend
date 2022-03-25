import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { AttackIDPropertyConfig } from '../attackid-property.component';
import { RestApiConnectorService } from '../../../../services/connectors/rest-api/rest-api-connector.service';
import { StixObject } from '../../../../classes/stix/stix-object';

@Component({
  selector: 'app-attackid-edit',
  templateUrl: './attackid-edit.component.html',
  styleUrls: ['./attackid-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AttackIDEditComponent {
  @Input() public config: AttackIDPropertyConfig;

  constructor(public restApiConnector: RestApiConnectorService) {}

  handleGenerateClick(): void {
    this.config.object = this.config.object as StixObject;
    this.config.object.generateAttackIDWithPrefix(this.restApiConnector);
  }
}
