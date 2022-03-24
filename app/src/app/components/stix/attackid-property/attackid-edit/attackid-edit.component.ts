import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { AttackIDPropertyConfig } from '../attackid-property.component';
import { RestApiConnectorService } from '../../../../services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-attackid-edit',
  templateUrl: './attackid-edit.component.html',
  styleUrls: ['./attackid-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AttackIDEditComponent {
  @Input() public config: AttackIDPropertyConfig;
  public generateClicked = false;

  constructor(private restApiConnector: RestApiConnectorService) {}
}
