import { Component, Input, ViewEncapsulation } from '@angular/core';
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
  public showHint = false;

  constructor(public restApiConnector: RestApiConnectorService) {}

  handleKeyup(val): void {
    this.config.object = this.config.object as StixObject;
    if (this.config.object.attackType === 'matrix') {
      this.config.object.generateAttackIDWithPrefix(this.restApiConnector, true, val);
      this.showHint = true;
    }
    else {
      this.config.object.attackID = val;
    }
  }

  handleGenerateClick(): void {
    this.config.object = this.config.object as StixObject;
    this.config.object.generateAttackIDWithPrefix(this.restApiConnector);
  }
}
