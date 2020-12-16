import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AssociationPropertyConfig } from '../association-property.component';

@Component({
  selector: 'app-association-view',
  templateUrl: './association-view.component.html',
  styleUrls: ['./association-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AssociationViewComponent implements OnInit {
  @Input() public config: AssociationPropertyConfig;
  public showMore: boolean = false;

  public toggleMore() : void { this.showMore = !this.showMore; }

  public get wrap() {
    return this.config.hasOwnProperty('wrap') ? this.config.wrap : true;
  }

  public get inlineCitations() {

    if (this.config.referencesField) {
      let value : string;

      let association_array : Array<string> = [];

      for (value of this.config.object[this.config.field]) {

        let association = value;

          if (this.config.object[this.config.referencesField].hasValue(value)) {
            // Get citations from description
            let descr = this.config.object[this.config.referencesField].getDescription(value)
            console.log(descr)
            // refHTML = "<span><sup><a href=\"" + reference.url + "\" class=\"external-link\" target=\"_blank\">[" + reference_number + "]</a></sup></span>";
          }

          association_array.push(association);
      }

      return association_array
  
    }

    return this.config[this.config.field]
  }

  public displayDescriptions() {

  }

  constructor() { }

  ngOnInit(): void {
  }

}
