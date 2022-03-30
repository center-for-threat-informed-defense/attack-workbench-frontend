import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AttackIDPropertyConfig } from '../attackid-property.component';
import { RestApiConnectorService } from '../../../../services/connectors/rest-api/rest-api-connector.service';
import { StixObject } from '../../../../classes/stix/stix-object';

@Component({
  selector: 'app-attackid-edit',
  templateUrl: './attackid-edit.component.html',
  styleUrls: ['./attackid-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AttackIDEditComponent implements OnInit {
  @Input() public config: AttackIDPropertyConfig;
  public showHint = false;
  public prefix = '';
  public namespaceRange = '';

  constructor(public restApiConnector: RestApiConnectorService) {}

  ngOnInit(): void {
    // Get namespace settings and prepend, if creating a new object
    if ((this.config.object as StixObject).firstInitialized) {
      let organizationNamespace = {};
      const namespaceSub = this.restApiConnector.getOrganizationNamespace().subscribe({
        next: (namespaceSettings) => {
          organizationNamespace = namespaceSettings;
          this.prefix = namespaceSettings.prefix ? namespaceSettings.prefix + '-' : '';
          this.namespaceRange = namespaceSettings.range_start;
        },
        complete: () => namespaceSub.unsubscribe()
      });
    } else { // Otherwise extract existing prefix, if any
      const found = (this.config.object as StixObject).attackID.match(/[A-Z]+-/g);
      if (found) {
        this.prefix = found[0];
      }
    }
  }

  prependPrefix(): void {
    const found = (this.config.object as StixObject).attackID.toUpperCase().match(/[A-Z]*[0-9]+[.0-9]*/g);
    if (found) {
      (this.config.object as StixObject).attackID = this.prefix + found[0];
      this.showHint = true;
    } else {
      this.showHint = false;
    }
  }

  handleGenerateClick(): void {
    if ((this.config.object as StixObject).supportsNamespace) {
      const
        sub = (this.config.object as StixObject).getNamespaceID(this.restApiConnector, this.namespaceRange).subscribe({
          next: (val) => {
            (this.config.object as StixObject).attackID = val;
            this.prependPrefix();
          },
          complete: () => sub.unsubscribe()
        });
    }
  }
}
