import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';
import {
  Paginated,
  RestApiConnectorService,
} from '../../../services/connectors/rest-api/rest-api-connector.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tlp-property',
  templateUrl: './tlp-property.component.html',
  styleUrls: ['./tlp-property.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TlpPropertyComponent implements OnInit {
  @Input() public config: TlpPropertyConfig;

  private tlpMarkingDefinitionsMap = {};
  private statementsMap = {};
  public data$: Observable<Paginated<StixObject>>;

  public get object() {
    return Array.isArray(this.config.object)
      ? this.config.object[0]
      : this.config.object;
  }

  constructor(private restAPIConnectorService: RestApiConnectorService) {
    // empty constructor
  }

  // Retrieves statements of current object
  public get objStatementsSTIXids(): any[] {
    const objStatementsSTIXidList = [];
    if (this.object['object_marking_refs']) {
      const objMarkingDefsStixIdList = this.object['object_marking_refs'];

      for (const index in objMarkingDefsStixIdList) {
        if (this.statementsMap[objMarkingDefsStixIdList[index]]) {
          objStatementsSTIXidList.push(
            this.statementsMap[objMarkingDefsStixIdList[index]]['stixID']
          );
        }
      }
    }
    return objStatementsSTIXidList;
  }

  public get tlp(): string {
    if (this.object['object_marking_refs']) {
      const objMarkingDefinitionsStixIdList =
        this.object['object_marking_refs'];

      for (const index in objMarkingDefinitionsStixIdList) {
        if (
          objMarkingDefinitionsStixIdList[index] in
          this.tlpMarkingDefinitionsMap
        ) {
          return this.tlpMarkingDefinitionsMap[
            objMarkingDefinitionsStixIdList[index]
          ]['definition_string'];
        }
      }
    }
    return 'none';
  }

  ngOnInit(): void {
    const options = {
      limit: 0,
      offset: 0,
      includeRevoked: false,
      includeDeprecated: false,
    };
    this.data$ = this.restAPIConnectorService.getAllMarkingDefinitions(options);
    const subscription = this.data$.subscribe({
      next: objects => {
        if (objects) {
          for (const index in objects.data) {
            // add tlp marking definitions
            if (objects.data[index]['definition_type'] == 'tlp') {
              this.tlpMarkingDefinitionsMap[objects.data[index]['stixID']] =
                objects.data[index];
            }
            if (objects.data[index]['definition_type'] == 'statement') {
              this.statementsMap[objects.data[index]['stixID']] =
                objects.data[index];
            }
          }
        }
      },
      complete: () => {
        subscription.unsubscribe();
      },
    });
  }
}

export interface TlpPropertyConfig {
  /* What is the current mode? Default: 'view
   *    view: viewing the TLP property
   *    diff: displaying the diff between two STIX objects. If this mode is selected, two StixObjects must be specified in the objects field
   */
  mode?: 'edit' | 'view' | 'diff';
  /* The object to show the TLP marking of
   * Note: if mode is diff, pass an array of two objects to diff
   */
  object: StixObject | [StixObject, StixObject];
}
