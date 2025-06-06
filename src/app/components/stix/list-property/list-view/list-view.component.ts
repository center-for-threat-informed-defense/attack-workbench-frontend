import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ListPropertyConfig } from '../list-property.component';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ListViewComponent {
  @Input() public config: ListPropertyConfig;

  public get wrap() {
    return this.config.hasOwnProperty('wrap') ? this.config.wrap : true;
  }

  public get values() {
    if (this.config.field == 'aliases')
      return this.config.object[this.config.field].slice(1); // filter out the first alias
    const arr = this.config.object[this.config.field];
    arr.sort();
    return arr;
  }
}
