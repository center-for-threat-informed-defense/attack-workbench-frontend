import { Component, Input, OnInit } from '@angular/core';
import { OrderedListPropertyConfig } from '../ordered-list-property.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-ordered-list-edit',
  templateUrl: './ordered-list-edit.component.html',
  styleUrls: ['./ordered-list-edit.component.scss']
})
export class OrderedListEditComponent implements OnInit {
  @Input() public config: OrderedListPropertyConfig;

  constructor() { }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.array, event.previousIndex, event.currentIndex);
  }

  ngOnInit(): void {
  }

  public get array(): Array<string> {
    let array : Array<string> = [];
    for (let object of this.config.objects) {
      array.push(object[this.config.field]);
    }
    return array;
  }

}
