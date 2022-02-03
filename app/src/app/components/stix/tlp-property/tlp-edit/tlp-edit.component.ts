import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent } from 'src/app/components/add-dialog/add-dialog.component';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { SelectionModel } from '@angular/cdk/collections';
import { TlpPropertyConfig } from '../tlp-property.component';

@Component({
  selector: 'app-tlp-edit',
  templateUrl: './tlp-edit.component.html',
  styleUrls: ['./tlp-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TlpEditComponent implements OnInit {
  @Input() public tlpMarkingDefinitionsMap: any;
  @Input() public tlp: string;
  @Input() public config: TlpPropertyConfig;
  @Input() public objStatementsSTIXids: string[];

  public select: SelectionModel<string>;

  public tlpClass() : string {
    if (this.tlp == "red") return "tlp-red";
    else if (this.tlp == "amber") return "tlp-amber";
    else if (this.tlp == "green") return "tlp-green";
    else if (this.tlp == "white") return "tlp-white";
    else return "";
  }

  // Update object statements with Dialog component
  public updateTlpMarking() {
      let rows: StixObject[] = [];
      for (let key in this.tlpMarkingDefinitionsMap) {
          rows.push(this.tlpMarkingDefinitionsMap[key]);
      }

      let current_selection = "";
      // set up selection
      this.select = new SelectionModel(true);
      for (let key in this.tlpMarkingDefinitionsMap) {
          if (this.tlpMarkingDefinitionsMap[key]["definition_string"] == this.tlp){
              this.select.select(this.tlpMarkingDefinitionsMap[key]["stixID"]); // Select current tlp to track in UI
              current_selection = this.tlpMarkingDefinitionsMap[key]["stixID"]; // save current selection
          }
      }
      
      let clearSelection = false;
      // If there is already a selection, dialog button label will say UPDATE instead of ADD
      let buttonLabelStr : string;
      if (this.select.selected.length > 0) {
          buttonLabelStr = "UPDATE";
          clearSelection = true;
      } else buttonLabelStr = "ADD";

      let prompt = this.dialog.open(AddDialogComponent, {
          maxWidth: '70em',
          maxHeight: '70em',
          data: {
          selectionType: 'one',
          selectableObjects: rows,
          select: this.select,
          type: "marking-definition",
          buttonLabel: buttonLabelStr,
          clearSelection: clearSelection
          },
      });

      let subscription = prompt.afterClosed().subscribe({
          next: (result) => {
              if (result && this.select.selected) {
                  // Check if there are two selections, ignore previous selection
                  let tlp_selection = this.select.selected;
                  console.log(this.select.selected);
                  if (this.select.selected.length > 1){
                      for (let i = 0; i < this.select.selected.length; i++) {
                          if (this.select.selected[i] != current_selection) {
                              tlp_selection = [this.select.selected[i]];
                          }
                      }
                  }

                  // first add statements if they exist
                  if (this.objStatementsSTIXids) {
                      this.config.object["object_marking_refs"] = this.objStatementsSTIXids;
                  }
                  else this.config.object["object_marking_refs"] = [];
                  this.config.object["object_marking_refs"].push(tlp_selection[0]); // add tlp selection
              }
          },
          complete: () => {
              subscription.unsubscribe();
          }, //prevent memory leaks
      });
  }

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

}
