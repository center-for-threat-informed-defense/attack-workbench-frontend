import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
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
  @Input() public statementsMap: any;
  @Input() public objStatements: any[];
  @Input() public tlpSTIXid: string;
  @Input() public config: StatementPropertyConfig;

  public select: SelectionModel<string>;

  // Update object statements with Dialog component
  public updateStatements(popover?: any) {

      // Prepare rows
      let rows: StixObject[] = [];
      for (let key in this.statementsMap) {
          rows.push(this.statementsMap[key]);
      }
      // set up selection
      this.select = new SelectionModel(true);
      let objStatements = this.objStatements;
      for (let i in objStatements) {
          this.select.select(objStatements[i]["stixID"]); // Select current statements by default
      }
      
      // If there is already a selection, dialog button label will say UPDATE instead of ADD
      let buttonLabelStr : string = "ADD";
      if (this.select.selected.length > 0) {
          buttonLabelStr = "UPDATE";
      }

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
                  // Set marking refs to selection
                  this.config.object["object_marking_refs"] = this.select.selected;
                  // re-add tlp
                  if (this.tlpSTIXid) this.config.object["object_marking_refs"].push(this.tlpSTIXid);
              }
              if (popover) setTimeout(() => popover.hide()); // wait for popover to hide
          },
          complete: () => {
              subscriptionPrompt.unsubscribe();
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
