import { Component, Input, OnInit } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-association-property',
  templateUrl: './association-property.component.html',
  styleUrls: ['./association-property.component.scss']
})
export class AssociationPropertyComponent implements OnInit {
  @Input() public config: AssociationPropertyConfig;

  constructor() { }

  ngOnInit(): void {
  }

}

export interface AssociationPropertyConfig {
  /* What is the current mode? Default: 'view
   *    view: viewing the association property
   *    edit: editing the association property
   *    diff: displaying the diff between two STIX objects. If this mode is selected, two StixObjects must be specified in the objects field
   */
  mode?: "view" | "edit" | "diff";
  /* The object to show the association of
   * Note: if mode is diff, pass an array of two objects to diff
   */
  object: StixObject | [StixObject, StixObject];
  /* the field of the object(s) to visualize as a association
   */
  field?: string;
  /* Default true if omitted. For the view mode, if false, 
  * overflow will be hidden and marked with an ellipses. 
  * A tooltip will provide the full value.
  */
  wrap?: boolean
}
