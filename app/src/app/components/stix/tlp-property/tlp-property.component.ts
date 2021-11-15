import { Component, Input, OnInit } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-tlp-property',
  templateUrl: './tlp-property.component.html',
  styleUrls: ['./tlp-property.component.scss']
})
export class TlpPropertyComponent implements OnInit {
  @Input() public config: TlpPropertyComponentConfig;

  constructor() { }

  ngOnInit(): void {
  }

}

export interface TlpPropertyComponentConfig {
  /* What is the current mode? Default: 'view
   *    view: viewing the TLP property
   *    diff: displaying the diff between two STIX objects. If this mode is selected, two StixObjects must be specified in the objects field
   */
  mode?: "view" | "diff";
  /* The object to show the TLP marking of
   * Note: if mode is diff, pass an array of two objects to diff
   */
  object: StixObject | [StixObject, StixObject];
}