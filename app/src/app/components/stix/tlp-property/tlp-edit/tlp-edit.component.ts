import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
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

  // initialize select and set current selection
  private initializeSelectAndSetCurrentSelection() {
      let current_selection = "";
      for (let key in this.tlpMarkingDefinitionsMap) {
          if (this.tlpMarkingDefinitionsMap[key]["definition_string"] == this.tlp) {
              this.select.select(this.tlpMarkingDefinitionsMap[key]["stixID"]); // Select current tlp to track in UI
              current_selection = this.tlpMarkingDefinitionsMap[key]["stixID"]; // save current selection
          }
      }
      return current_selection;
  }

  // Update object statements with Dialog component
  public updateTlpMarking() {
      let rows: StixObject[] = [];
      for (let key in this.tlpMarkingDefinitionsMap) {
          rows.push(this.tlpMarkingDefinitionsMap[key]);
      }

      // set up selection
      this.select = new SelectionModel(true);
      let current_selection = this.initializeSelectAndSetCurrentSelection();
      
      let clearSelection = false;
      // If there is already a selection, dialog button label will say UPDATE instead of ADD
      let buttonLabelStr : string = "ADD";
      if (this.select.selected.length > 0) {
          buttonLabelStr = "UPDATE";
          clearSelection = true;
      }

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
                  let tlp_selection = this.select.selected;
                  // Check if there are two selections, ignore previous selection
                  for (let selection of this.select.selected) {
                      if (selection != current_selection) tlp_selection = [selection];
                  }

                  // first add marking definition statements if they exist
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

  constructor(public dialog: MatDialog) {
      // empty constructor
  }

  ngOnInit(): void {
      // empty on init
  }

}
