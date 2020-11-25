import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ExternalReferencesPropertyConfig } from '../external-references-property.component';
import { ExternalReference } from 'src/app/classes/external-references';

@Component({
  selector: 'app-external-references-view',
  templateUrl: './external-references-view.component.html',
  styleUrls: ['./external-references-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExternalReferencesViewComponent implements OnInit {
  @Input() public config: ExternalReferencesPropertyConfig;
  public half: number;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * get list of references that will appear on the external references
   * section
   */
  public get display(): Array<[number, ExternalReference]> {

    let display = this.config.referencesField.list();
    this.half = (Math.ceil(display.length / 2));
    return display;
  }

}
