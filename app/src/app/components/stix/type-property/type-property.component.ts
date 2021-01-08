import { Component, Input, OnInit } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-type-property',
  templateUrl: './type-property.component.html',
  styleUrls: ['./type-property.component.scss']
})
export class TypePropertyComponent implements OnInit {
  @Input() public config: TypePropertyConfig;

  constructor() { }

  ngOnInit(): void {
  }

}

export interface TypePropertyConfig {
  /* What is the current mode? Default: 'view
   *    view: viewing the list property
   *    edit: editing the list property
   *    diff: displaying the diff between two STIX objects. If this mode is selected, two StixObjects must be specified in the objects field
   */
  mode?: "view" | "edit" | "diff";
  /* The object to show the field of
   * Note: if mode is diff, pass an array of two objects to diff
   */
  object: StixObject | [StixObject, StixObject];
}