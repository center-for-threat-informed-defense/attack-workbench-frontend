import {
  Component,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
  EventEmitter,
} from '@angular/core';
import { AttackIDPropertyConfig } from '../attackid-property.component';
import { RestApiConnectorService } from '../../../../services/connectors/rest-api/rest-api-connector.service';
import { StixObject } from '../../../../classes/stix/stix-object';

@Component({
  selector: 'app-attackid-edit',
  templateUrl: './attackid-edit.component.html',
  styleUrls: ['./attackid-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class AttackIDEditComponent implements OnInit {
  @Input() public config: AttackIDPropertyConfig;
  @Output() public attackIdGenerated = new EventEmitter();
  public prefix = '';

  constructor(public restApiConnector: RestApiConnectorService) {}

  ngOnInit(): void {
    // Get namespace settings and prepend, if creating a new object
    if ((this.config.object as StixObject).firstInitialized) {
      const namespaceSub = this.restApiConnector
        .getOrganizationNamespace()
        .subscribe({
          next: namespaceSettings => {
            this.prefix = namespaceSettings.prefix ?? '';
          },
          complete: () => namespaceSub.unsubscribe(),
        });
    } else {
      // Otherwise extract existing prefix, if any
      const found = (this.config.object as StixObject).attackID.match(
        /[A-Z]+-/g
      );
      if (found) {
        this.prefix = found[0].replace(/-$/, '');
      }
    }
  }

  public handleGenerateClick(): void {
    if ((this.config.object as StixObject).supportsAttackID) {
      const sub = (this.config.object as StixObject)
        .generateAttackId(this.restApiConnector, this.prefix)
        .subscribe({
          next: val => {
            (this.config.object as StixObject).attackID = val;
          },
          complete: () => {
            this.attackIdChanged();
            sub.unsubscribe();
          },
        });
    }
  }

  public attackIdChanged(): void {
    this.attackIdGenerated.emit();
  }

  public formatAttackId(): void {
    // handle user set attack id
    const object = this.config.object as StixObject;
    const withPrefix = object.formatWithPrefix(object.attackID, this.prefix);
    (this.config.object as StixObject).attackID = withPrefix;
  }
}
