import { Component, Input, OnInit } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-statement-property',
  templateUrl: './statement-property.component.html',
  styleUrls: ['./statement-property.component.scss']
})
export class StatementPropertyComponent implements OnInit {
  @Input() public config: StatementPropertyConfig;

  constructor() { }
  
  ngOnInit(): void {}
}

export interface StatementPropertyConfig {
  /* What is the current mode? Default: 'view
   *    view: viewing the statement property
   *    edit: editing the statement property
   *    diff: displaying the diff between two STIX objects. If this mode is selected, two StixObjects must be specified in the objects field
   */
  mode?: "view" | "edit" | "diff" ;
  /* The object to show the statement of
   * Note: if mode is diff, pass an array of two objects to diff
   */
  object: StixObject | [StixObject, StixObject];
}
