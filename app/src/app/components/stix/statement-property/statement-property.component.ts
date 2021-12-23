import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { Paginated, RestApiConnectorService } from '../../../services/connectors/rest-api/rest-api-connector.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { AddDialogComponent } from 'src/app/components/add-dialog/add-dialog.component';

@Component({
  selector: 'app-statement-property',
  templateUrl: './statement-property.component.html',
  styleUrls: ['./statement-property.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StatementPropertyComponent implements OnInit {
    @Input() public config: StatementPropertyConfig;

    public select: SelectionModel<string>;
    private statementsMap = {}; // map of marking definitions with STIX id as key to object
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

    // Creates map of statements
    private createStatementMap(): void {    
        for (let index in this.markingDefinitions.data) {
            if (this.markingDefinitions.data[index]["definition_type"] == "statement") {
                this.statementsMap[this.markingDefinitions.data[index]["stixID"]] = this.markingDefinitions.data[index];
            }
        }
    }

    public updateStatements() {
        let rows: StixObject[] = this.markingDefinitions.data;
        let list = [];
        // set up selection
        this.select = new SelectionModel(true);
        let objStatements = this.objStatements;
        for (let i in objStatements) {
            this.select.select(objStatements[i]["stixID"]); // Select current statements by default
        }
        
        // If there is already a selection, dialog button label will say UPDATE instead of ADD
        let buttonLabelStr : string;
        if (this.select.selected.length > 0) {
            buttonLabelStr = "UPDATE";
        } else buttonLabelStr = "ADD";

        let prompt = this.dialog.open(AddDialogComponent, {
            maxWidth: '70em',
            maxHeight: '70em',
            data: {
            selectableObjects: rows,
            select: this.select,
            type: "marking-definition",
            buttonLabel: buttonLabelStr
            },
        });

        let subscription = prompt.afterClosed().subscribe({
            next: (result) => {
                if (result && this.select.selected) {
                    // Set marking refs to selection
                    this.config.object["object_marking_refs"] = this.select.selected;
                }
            },
            complete: () => {
                subscription.unsubscribe();
            }, //prevent memory leaks
        });
    }

    constructor(private restAPIConnectorService: RestApiConnectorService, public dialog: MatDialog) { }

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
