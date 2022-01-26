import { Component, OnInit } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { SelectionModel } from '@angular/cdk/collections';
import { AddDialogComponent } from 'src/app/components/add-dialog/add-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Paginated, RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

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
              if (data) {
                this.markingDefinitions = data;
              }
            },
            complete: () => { subscription.unsubscribe() }
        })
    }

    public updateDefaultMarkingDefs() {
        let subscription = this.restAPIConnectorService.getDefaultMarkingDefinitions().subscribe({
            next: (result) => {
              let rows: StixObject[] = this.markingDefinitions.data;
              // set up selection
              this.select = new SelectionModel(true);

              let currentDefaultMarkingDefs = result;
              
              for (let i in currentDefaultMarkingDefs) {
                  this.select.select(currentDefaultMarkingDefs[i].stix.id); // Select current statements by default
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
                          // Set default marking refs to selection
                          let subscription = this.restAPIConnectorService.postDefaultMarkingDefinitions(this.select.selected).subscribe({
                              next: () => {},
                              complete: () => { subscription.unsubscribe(); } // prevent memory leaks
                          })
                      }
                  },
                  complete: () => {
                      subscription.unsubscribe();
                  }, //prevent memory leaks
              });
            },
            complete: () => subscription.unsubscribe()
        });
    }
 }

