import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-stixid-property',
  templateUrl: './stixid-property.component.html',
  styleUrls: ['./stixid-property.component.scss'],
  standalone: false,
})
export class StixIDPropertyComponent {
  @Input() public config: StixIDPropertyConfig;
  public get stixIdLink(): string {
    return `${this.object['stixID']}`;
  }
  public get object(): StixObject {
    return Array.isArray(this.config.object)
      ? this.config.object[0]
      : this.config.object;
  }

  constructor(public snackbar: MatSnackBar) {
    // intentionally left blank
  }
}
export interface StixIDPropertyConfig {
  /* What is the current mode?
   *    view: viewing the list property
   */
  mode: 'view';
  /* The object to show the field of
   * Note: if mode is diff, pass an array of two objects to diff
   */
  object: StixObject | [StixObject, StixObject];
}
