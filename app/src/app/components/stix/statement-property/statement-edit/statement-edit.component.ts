import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent } from 'src/app/components/add-dialog/add-dialog.component';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { SelectionModel } from '@angular/cdk/collections';
import { StatementPropertyConfig } from '../statement-property.component';

@Component({
  selector: 'app-statement-edit',
  templateUrl: './statement-edit.component.html',
  styleUrls: ['./statement-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class StatementEditComponent implements OnInit {
  @Input() public markingDefinitions: any;
  @Input() public objStatements: any[];
  @Input() public config: StatementPropertyConfig;

  public select: SelectionModel<string>;

  // Update object statements with Dialog component
  public updateStatements() {
      let rows: StixObject[] = this.markingDefinitions.data;
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

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

}
