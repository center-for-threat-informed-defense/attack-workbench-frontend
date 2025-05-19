import { Component, Input, OnInit } from '@angular/core';
import { OrderedListPropertyConfig } from '../ordered-list-property.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent } from 'src/app/components/add-dialog/add-dialog.component';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { SelectionModel } from '@angular/cdk/collections';
import { logger } from '../../../../utils/logger';
@Component({
  selector: 'app-ordered-list-edit',
  templateUrl: './ordered-list-edit.component.html',
  styleUrls: ['./ordered-list-edit.component.scss'],
  standalone: false,
})
export class OrderedListEditComponent implements OnInit {
  @Input() public config: OrderedListPropertyConfig;

  public orderedList: string[] = [];
  public select: SelectionModel<string>;
  private listMap = new Map<string, StixObject>(); // Dictionary to quickly find stix objects by the config field

  constructor(private dialog: MatDialog) {}

  /**
   *
   * Updates ordered list on drag and drop
   * @param event indexes of where the element got moved to and from
   */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
  }

  ngOnInit(): void {
    // intentionally left blank
  }

  private _idToLabel: Map<string, string>;
  /**
   * Get a human readable label for the given object
   *
   * @param {string} id the stix ID to get
   */
  public getLabel(id: string) {
    if (!this._idToLabel) {
      this._idToLabel = new Map();
      for (const object of this.config.globalObjects) {
        this._idToLabel.set(object.stixID, object[this.config.field]);
      }
    }
    return this._idToLabel.get(id);
  }

  /**
   *
   * helper getter for the list being ordered
   */
  public get list(): string[] {
    return this.config.object[this.config.objectOrderedListField];
  }

  /**
   *
   * Reorders the orderedList array according to params. Swaps the two elements in the params
   * @param {int} from the 1st index to swap
   * @param {int} to the 2nd index to swap
   */
  public moveRow(from, to) {
    if (
      from < 0 ||
      from > this.list.length - 1 ||
      to < 0 ||
      to > this.list.length - 1
    ) {
      logger.warn('invalid indexes for tactic reorder', from, to);
      return;
    }
    const fromRow = this.list[from];
    const toRow = this.list[to];
    this.list[from] = toRow;
    this.list[to] = fromRow;
  }

  /**
   *
   * Removes row from ordered list with index
   * @param {int} index array index of item to be deleted from list
   */
  public deleteRow(index) {
    const prompt = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '35em',
      data: {
        message: '# Remove ' + this.getLabel(this.list[index]) + '?',
      },
      autoFocus: false, // prevents auto focus on toolbar buttons
    });

    const subscription = prompt.afterClosed().subscribe({
      next: result => {
        if (result) {
          // Remove from ordered list by index
          this.list.splice(index, 1);
        }
      },
      complete: () => {
        subscription.unsubscribe();
      }, //prevent memory leaks
    });
  }

  /**
   *
   * Add row to the end of ordered list
   */
  public addRow() {
    let uniqueRows: StixObject[] = [];

    // Check if field of global objects is already in ordered list
    uniqueRows = this.config.globalObjects.filter(
      x => !this.list.includes(x.stixID)
    );

    if (uniqueRows) {
      // set up selection
      this.select = new SelectionModel(true);

      const prompt = this.dialog.open(AddDialogComponent, {
        maxWidth: '60em',
        maxHeight: '60em',
        data: {
          title: `add a ${this.config.type}`,
          selectableObjects: uniqueRows,
          select: this.select,
          type: this.config.type,
        },
      });

      const subscription = prompt.afterClosed().subscribe({
        next: result => {
          if (result && this.select.selected) {
            for (const stixID of this.select.selected) {
              this.list.push(stixID);
            }
          }
        },
        complete: () => {
          subscription.unsubscribe();
        }, //prevent memory leaks
      });
    }
  }
}
