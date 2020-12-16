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

  constructor() { }

  ngOnInit(): void {
  }

}
