import { Component, OnInit, Input } from '@angular/core';
import { Paginated, RestApiConnectorService } from '../../../../services/connectors/rest-api/rest-api-connector.service';
import { Observable } from 'rxjs';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { StatementPropertyConfig } from '../statement-property.component';
import { NONE_TYPE } from '@angular/compiler';

@Component({
    selector: 'app-statement-view',
    templateUrl: './statement-view.component.html',
    styleUrls: ['./statement-view.component.scss']
})
export class StatementViewComponent implements OnInit {
    @Input() public config: StatementPropertyConfig;

    private statementsMap = {};

    public data$: Observable<Paginated<StixObject>>;
    public markingDefinitions : any;

    public get objStatements(): any[] {
        let objectStatements = []
        if (this.config.object["object_marking_refs"]){
            this.createStatementMap(); // Create Statement map
            let objStatementsStixIdList = this.config.object["object_marking_refs"];

            for (let index in objStatementsStixIdList) {
                if (this.statementsMap[objStatementsStixIdList[index]]) {
                    objectStatements.push(this.statementsMap[objStatementsStixIdList[index]]);
                }
            }
        }
        return objectStatements;
    }

    public createStatementMap(): any {        
        for (let index in this.markingDefinitions.data) {
            if (this.markingDefinitions.data[index]["definition_type"] == "statement") {
                this.statementsMap[this.markingDefinitions.data[index]["stixID"]] = this.markingDefinitions.data[index];
            }
        }
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
            next: (data) => { if (data) this.markingDefinitions = data;},
            complete: () => { subscription.unsubscribe() }
        })
    }
}