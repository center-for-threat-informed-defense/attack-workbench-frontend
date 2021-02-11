import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-ordered-list-property',
  templateUrl: './ordered-list-property.component.html',
  styleUrls: ['./ordered-list-property.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderedListPropertyComponent implements OnInit {
  @Input() public config: OrderedListPropertyConfig;

  constructor() { }

  ngOnInit(): void {
  }

}

export interface OrderedListPropertyConfig {
  /* What is the current mode? Default: 'view
   *    view: viewing the ordered list property
   *    edit: editing the ordered list property
   */
  mode?: "view" | "edit";
  /*  Array of objects that will be used to display ordered list
   */
  objects: StixObject[];
  /* Field from object to be displayed 
  */
  field: string;
  /* Object
  */
  object?: StixObject;
  /* List field name from object to be displayed 
  */
  listField?: string;
  /* global objects fields to add to object list 
  */
  globalObjects? : StixObject[];
}