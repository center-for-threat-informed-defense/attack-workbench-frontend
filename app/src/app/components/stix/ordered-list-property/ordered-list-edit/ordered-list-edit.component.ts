import { Component, Input, OnInit } from '@angular/core';
import { OrderedListPropertyConfig } from '../ordered-list-property.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent } from 'src/app/components/add-dialog/add-dialog.component';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-ordered-list-edit',
  templateUrl: './ordered-list-edit.component.html',
  styleUrls: ['./ordered-list-edit.component.scss']
})
export class OrderedListEditComponent implements OnInit {
  @Input() public config: OrderedListPropertyConfig;

  public orderedList : string[] = [];
  private ListMap : Map<string, any> = new Map();

  constructor(private dialog: MatDialog) { }

  /**
   *
   * Updates ordered list on drag and drop
   * @param event indexes of where the element got moved to and from
   */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.orderedList, event.previousIndex, event.currentIndex);
    this.updateOrderedList();
  }

  ngOnInit(): void {
  }

  /**
   * 
   * Creates and returns list from object list
   */
  public get list(): string[] {

    if (this.orderedList.length === 0){
      for (let object of this.config.objects) {
        this.orderedList.push(object[this.config.field]);
        this.ListMap.set(object[this.config.field], object);
      }
    }

    return this.orderedList;
  }

  /**
   * 
   * Update object with ordered list.
   */
  private updateOrderedList() : void {
    let tempObjectList : string[] = [];
    for (let row of this.orderedList) {
      if (this.ListMap.get(row)) tempObjectList.push(this.ListMap.get(row)["stixID"]);
    }
    // Update object and list array
    this.config.object[this.config.listField] = tempObjectList;
  }

  /**
   *
   * Reorders the orderedList array according to params. Swaps the two elements in the params
   * @param {int} from the 1st index to swap
   * @param {int} to the 2nd index to swap
   */
  public moveRow(from, to) {
    if (from < 0 || from > this.orderedList.length - 1 ||
        to < 0 || to > this.orderedList.length - 1) {
        console.warn("invalid indexes for tactic reorder");
        return;
    }
    let fromRow = this.orderedList[from];
    let toRow = this.orderedList[to];
    this.orderedList[from] = toRow;
    this.orderedList[to] = fromRow;

    this.updateOrderedList();
  }

  /**
   *
   * Removes row from ordered list
   * @param {int} row item to be deleted from list
   */
  public deleteRow(row) {
    let prompt = this.dialog.open(ConfirmationDialogComponent, {
          maxWidth: "35em",
          data: { 
              message: '# Delete ' + this.orderedList[row] + '?',
          }
      });

    let subscription = prompt.afterClosed().subscribe({
      next: (result) => {
          if (result) {
            this.orderedList.splice(row, 1);
            this.updateOrderedList();
          }
      },
      complete: () => { subscription.unsubscribe(); } //prevent memory leaks
    });
  }

  /**
   *
   * Add row to the end of ordered list
   */
  public addRow() {

    let uniqueRows : StixObject[] = [];

    // Check if field of global objects is already in ordered list
    // TODO: need to be flexible to in page removes plus additions
    // Need to be able to track changes to ListMap
    for (let object of this.config.globalObjects) {
      if (!this.ListMap.get(object[this.config.field])) {
        uniqueRows.push(object);
      }
    }

    if(uniqueRows){
      let prompt = this.dialog.open(AddDialogComponent, {
        maxWidth: "70em",
        maxHeight: "70em",
        data: {
          globalObjects: uniqueRows,
          field: this.config.field
        }
      }) ;

      let subscription = prompt.afterClosed().subscribe({
          next: (result) => {
              if (result) {
                  console.log("adding: ", result);
                  this.orderedList.push(result[this.config.field]);
                  this.updateOrderedList();
              }
          },
          complete: () => { subscription.unsubscribe(); } //prevent memory leaks
      })
    }

  }
}
