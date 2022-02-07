import { Component, OnInit } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { SelectionModel } from '@angular/cdk/collections';
import { AddDialogComponent } from 'src/app/components/add-dialog/add-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Paginated, RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-default-marking-definitions',
  templateUrl: './default-marking-definitions.component.html',
  styleUrls: ['./default-marking-definitions.component.scss']
})
export class DefaultMarkingDefinitionsComponent implements OnInit {
    public select: SelectionModel<string>;
    public data$: Observable<Paginated<StixObject>>;
    public markingDefinitions : any;

    constructor(public dialog: MatDialog, private restAPIConnectorService: RestApiConnectorService) { }

    ngOnInit(): void {
        let options = {
            limit: 0, 
            offset: 0,
            includeRevoked: false, 
            includeDeprecated: false
        }
        this.data$ = this.restAPIConnectorService.getAllMarkingDefinitions(options);
        let subscription = this.data$.subscribe({
            next: (data) => { 
              if (data) this.markingDefinitions = data;
            },
            complete: () => { subscription.unsubscribe() }
        })
    }

    public updateDefaultMarkingDefs() {
        let subscriptionGet = this.restAPIConnectorService.getDefaultMarkingDefinitions().subscribe({
            next: (getResult) => {
                let rows: StixObject[] = [];
                
                // only add statements
                for (let markingDefinition of this.markingDefinitions.data) {
                    if (markingDefinition["definition_type"] == "statement") {
                        rows.push(markingDefinition);
                    }
                }
                // set up selection
                this.select = new SelectionModel(true);

                let currentDefaultMarkingDefs = getResult;
                
                for (let i in currentDefaultMarkingDefs) {
                    this.select.select(currentDefaultMarkingDefs[i].stix.id); // Select current statements by default
                }
                
                // If there is already a selection, dialog button label will say UPDATE instead of ADD
                let buttonLabelStr : string = "ADD";
                if (this.select.selected.length > 0) buttonLabelStr = "UPDATE";
        
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
        
                let subscriptionPrompt = prompt.afterClosed().subscribe({
                    next: (promptResult) => {
                        if (promptResult && this.select.selected) {
                            // Set default marking refs to selection
                            let subscriptionPost = this.restAPIConnectorService.postDefaultMarkingDefinitions(this.select.selected).subscribe({
                                complete: () => { subscriptionPost.unsubscribe(); } // prevent memory leaks
                            })
                        }
                    },
                    complete: () => {
                        subscriptionPrompt.unsubscribe();
                    }, //prevent memory leaks
                });
            },
            complete: () => subscriptionGet.unsubscribe()
        });
    }
}

