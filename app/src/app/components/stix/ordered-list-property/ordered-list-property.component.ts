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
  /* Field from ordered list objects to be displayed; e.g., 'name'
  */
  field: string;
  /* Object to be edited
  */
  object?: StixObject;
  /*  Ordered list field from object to be edited; e.g., 'tactic_refs' from matrix objects
  */
  objectOrderedListField?: string;
  /* global objects to add to object ordered list
   * Should be the same type of the object
   */
  globalObjects? : StixObject[];
  /* type of object to display stix lists
  */
  type? : string;
}