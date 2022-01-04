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
  @Input() public tlpMarkingDefinitions: any;
  @Input() public tlp: string;
  @Input() public config: TlpPropertyConfig;

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
      let rows: StixObject[] = this.tlpMarkingDefinitions.data;
      // set up selection
      this.select = new SelectionModel(true);
      // let objStatements = this.objStatements;
      // for (let i in objStatements) {
      //     this.select.select(objStatements[i]["stixID"]); // Select current statements by default
      // }
      
      // If there is already a selection, dialog button label will say UPDATE instead of ADD
      let buttonLabelStr : string;
      if (this.select.selected.length > 0) {
          buttonLabelStr = "UPDATE";
      } else buttonLabelStr = "ADD";

      let prompt = this.dialog.open(AddDialogComponent, {
          maxWidth: '70em',
          maxHeight: '70em',
          data: {
          selectionType: 'one',
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

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

}
