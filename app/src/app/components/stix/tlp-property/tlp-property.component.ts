import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { Paginated, RestApiConnectorService } from '../../../services/connectors/rest-api/rest-api-connector.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tlp-property',
  templateUrl: './tlp-property.component.html',
  styleUrls: ['./tlp-property.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TlpPropertyComponent implements OnInit {
  @Input() public config: TlpPropertyConfig;

  private tlpMarkingDefinitionsMap = {};
  private statementsMap = {};
  public data$: Observable<Paginated<StixObject>>;

  constructor(private restAPIConnectorService: RestApiConnectorService) { 
      // empty constructor
  }

  // Retrieves statements of current Object
  public get objStatementsSTIXids(): any[] {
      let objStatementsSTIXidList = []
      if (this.config.object["object_marking_refs"]){
          let objMarkingDefsStixIdList = this.config.object["object_marking_refs"];

          for (let index in objMarkingDefsStixIdList) {
              if (this.statementsMap[objMarkingDefsStixIdList[index]]) {
                objStatementsSTIXidList.push(this.statementsMap[objMarkingDefsStixIdList[index]]["stixID"]);
              }
          }
      }
      return objStatementsSTIXidList;
  }

  public get tlp(): string {
      if (this.config.object["object_marking_refs"]){
          let objMarkingDefinitionsStixIdList = this.config.object["object_marking_refs"];

          for (let index in objMarkingDefinitionsStixIdList) {
              if (objMarkingDefinitionsStixIdList[index] in this.tlpMarkingDefinitionsMap) {
                  return this.tlpMarkingDefinitionsMap[objMarkingDefinitionsStixIdList[index]]["definition_string"];
              }
          }
      }
      return "none";
  }

  ngOnInit(): void {
      let options = {
          limit: 0, 
          offset: 0,
          includeRevoked: false, 
          includeDeprecated: false
      }
      this.data$ = this.restAPIConnectorService.getAllMarkingDefinitions(options);
      let subscription = this.data$.subscribe({
          next: (objects) => { 
              if (objects) {
                  for (let index in objects.data) { // add tlp marking definitions
                    if (objects.data[index]["definition_type"] == "tlp") {
                        this.tlpMarkingDefinitionsMap[objects.data[index]["stixID"]] = objects.data[index];
                    }
                    if (objects.data[index]["definition_type"] == "statement") {
                      this.statementsMap[objects.data[index]["stixID"]] = objects.data[index];
                  }
                  }
              }
          },
          complete: () => { subscription.unsubscribe() }
      })
  }

}

export interface TlpPropertyConfig {
  /* What is the current mode? Default: 'view
   *    view: viewing the TLP property
   *    diff: displaying the diff between two STIX objects. If this mode is selected, two StixObjects must be specified in the objects field
   */
  mode?: "view" | "diff";
  /* The object to show the TLP marking of
   * Note: if mode is diff, pass an array of two objects to diff
   */
  object: StixObject | [StixObject, StixObject];
}