import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent } from 'src/app/components/add-dialog/add-dialog.component';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { SelectionModel } from '@angular/cdk/collections';
import { StatementPropertyConfig } from '../statement-property.component';

@Component({
  selector: 'app-statement-edit',
  templateUrl: './statement-edit.component.html',
  styleUrls: ['./statement-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class StatementEditComponent {
  @Input() public statementsMap: any;
  @Input() public tlpStixId: string;
  @Input() public config: StatementPropertyConfig;

  public get object() {
    return Array.isArray(this.config.object)
      ? this.config.object[0]
      : this.config.object;
  }

  public select: SelectionModel<string>;

  // Update object statements with Dialog component
  public updateStatements() {
    // Prepare rows
    const rows: StixObject[] = [];
    for (const key in this.statementsMap) {
      rows.push(this.statementsMap[key]);
    }
    // set up selection
    this.select = new SelectionModel(true);
    const objStatements = this.objStatements;
    for (const i in objStatements) {
      this.select.select(objStatements[i]['stixID']); // Select current statements by default
    }

    // If there is already a selection, dialog button label will say UPDATE instead of ADD
    let buttonLabelStr = 'ADD';
    if (this.select.selected.length > 0) {
      buttonLabelStr = 'UPDATE';
    }

    const prompt = this.dialog.open(AddDialogComponent, {
      maxWidth: '70em',
      maxHeight: '70em',
      data: {
        selectableObjects: rows,
        select: this.select,
        type: 'marking-definition',
        buttonLabel: buttonLabelStr,
      },
    });

    const subscriptionPrompt = prompt.afterClosed().subscribe({
      next: promptResult => {
        if (promptResult && this.select.selected) {
          // Set marking refs to selection
          this.object['object_marking_refs'] = this.select.selected;
          // re-add tlp, if one exists
          if (this.tlpStixId)
            this.object['object_marking_refs'].push(this.tlpStixId);
        }
      },
      complete: () => {
        subscriptionPrompt.unsubscribe();
      }, //prevent memory leaks
    });
  }

  // Retrieves statements of current Object
  public get objStatements(): any[] {
    const objectStatements = [];
    if (this.object['object_marking_refs']) {
      for (const stixId of this.object['object_marking_refs']) {
        if (this.statementsMap[stixId])
          objectStatements.push(this.statementsMap[stixId]);
      }
    }
    return objectStatements;
  }

  constructor(public dialog: MatDialog) {
    // intentionally left blank
  }
}
