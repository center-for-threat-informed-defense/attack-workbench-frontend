import { Component, Input, OnInit } from '@angular/core';
import { OrderedListPropertyConfig } from '../ordered-list-property.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent } from 'src/app/components/add-dialog/add-dialog.component';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { SelectionModel } from '@angular/cdk/collections';
import { NONE_TYPE } from '@angular/compiler';

@Component({
  selector: 'app-ordered-list-edit',
  templateUrl: './ordered-list-edit.component.html',
  styleUrls: ['./ordered-list-edit.component.scss']
})
export class OrderedListEditComponent implements OnInit {
  @Input() public config: OrderedListPropertyConfig;

  public orderedList : string[] = [];
  public select: SelectionModel<string>;
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

    // Initialize ordered list only when page is loaded
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
   * Removes row from ordered list with index
   * @param {int} index array index of item to be deleted from list
   */
  public deleteRow(index) {
    let prompt = this.dialog.open(ConfirmationDialogComponent, {
          maxWidth: "35em",
          data: { 
              message: '# Remove ' + this.orderedList[index] + '?',
          }
      });

    let subscription = prompt.afterClosed().subscribe({
      next: (result) => {
          if (result) {
            // Remove index of row from map
            this.removeFromMap(index);
            // Remove from ordered list by index
            this.orderedList.splice(index, 1);
            // Update ordered list
            this.updateOrderedList();
          }
      },
      complete: () => { subscription.unsubscribe(); } //prevent memory leaks
    });
  }

  /**
   * Delete index from ordered list map
   * @param {int} index index of item to be deleted from map
   */ 
  private removeFromMap(index) {
    if(this.ListMap.get(this.orderedList[index])){
      this.ListMap.delete(this.orderedList[index]);
    }
  }

  /**
   * Add row to ordered list map
   * @param {int} row item to be added to map
   */ 
  private addToMap(row) {
    if(!this.ListMap.get(row[this.config.field])) {
      this.ListMap.set(row[this.config.field], row);
    }
  }

  /** 
   * Get object from stixID
   * @param {string} stixID of object
  */
  private getObjectFromStixID(stixID) {
    // Check if field of global objects is already in ordered list
    for (let object of this.config.globalObjects) {
      console.log(object);
      if (object["stixID"] == stixID) return object;
    }

    return null;
  }

  /**
   *
   * Add row to the end of ordered list
   */
  public addRow() {

    let uniqueRows : StixObject[] = [];

    // Check if field of global objects is already in ordered list
    for (let object of this.config.globalObjects) {
      if (!this.ListMap.get(object[this.config.field])) {
        uniqueRows.push(object);
      }
    }

    if(uniqueRows){
      // set up selection
      this.select = new SelectionModel(true);

      let prompt = this.dialog.open(AddDialogComponent, {
        maxWidth: "70em",
        maxHeight: "70em",
        data: {
          globalObjects: uniqueRows,
          field: this.config.field,
          select: this.select,
          type: this.config.type
        }
      }) ;

      let subscription = prompt.afterClosed().subscribe({
          next: (result) => {
              if (result) {
                  if (this.select.selected) {
                    for (let stixID of this.select.selected) {
                      // get object of stixID
                      let object = this.getObjectFromStixID(stixID);
                      if (object) {
                        // Add result as row to map
                        this.addToMap(object);
                        // Add to ordered list
                        this.orderedList.push(object[this.config.field]);
                        // Update ordered list
                        this.updateOrderedList();
                      }
                    }
                  }
              }
          },
          complete: () => { subscription.unsubscribe(); } //prevent memory leaks
      })
    }

  }
}
