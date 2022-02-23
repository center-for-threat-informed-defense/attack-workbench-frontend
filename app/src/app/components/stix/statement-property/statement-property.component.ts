import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { Paginated, RestApiConnectorService } from '../../../services/connectors/rest-api/rest-api-connector.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-statement-property',
  templateUrl: './statement-property.component.html',
  styleUrls: ['./statement-property.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StatementPropertyComponent implements OnInit {
    @Input() public config: StatementPropertyConfig;

    public data$: Observable<Paginated<StixObject>>;
    private statementsMap = {}; // map of marking definitions with STIX id as key to object
    private tlpMap = {};

    // Retrieves statements of current Object
    public get objStatements(): any[] {
        let objectStatements = []
        if (this.config.object["object_marking_refs"]){
            let objStatementsStixIdList = this.config.object["object_marking_refs"];

            for (let index in objStatementsStixIdList) {
                if (this.statementsMap[objStatementsStixIdList[index]]) {
                    objectStatements.push(this.statementsMap[objStatementsStixIdList[index]]);
                }
            }
        }
        return objectStatements;
    }

    // Retrieves tlp marking definition of current Object
    public get tlpSTIXid(): string {
        if (this.config.object["object_marking_refs"]){
            let objStatementsStixIdList = this.config.object["object_marking_refs"];

            for (let index in objStatementsStixIdList) {
                if (this.tlpMap[objStatementsStixIdList[index]]) {
                    return objStatementsStixIdList[index];
                }
            }
        }
        return "";
    }

    constructor(private restAPIConnectorService: RestApiConnectorService) { }

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
                if ("data" in objects) {
                    for (let index in objects.data) { // Populate statements map with marking definitions statements
                        if (objects.data[index]["definition_type"] == "statement") {
                            this.statementsMap[objects.data[index]["stixID"]] = objects.data[index];
                        }
                        if (objects.data[index]["definition_type"] == "tlp") {
                            this.tlpMap[objects.data[index]["stixID"]] = objects.data[index];
                        }
                    }
                }
              }
            },
            complete: () => { subscription.unsubscribe() }
        })
    }
}

export interface StatementPropertyConfig {
  /* What is the current mode? Default: 'view
   *    view: viewing the statement property
   *    edit: editing the statement property
   *    diff: displaying the diff between two STIX objects. If this mode is selected, two StixObjects must be specified in the objects field
   */
  mode?: "view" | "edit" | "diff" ;
  /* The object to show the statement of
   * Note: if mode is diff, pass an array of two objects to diff
   */
  object: StixObject | [StixObject, StixObject];
}
