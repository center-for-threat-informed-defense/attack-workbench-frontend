import { Component, Input } from '@angular/core';
import { ListPropertyConfig } from '../list-property.component';

@Component({
  selector: 'app-list-diff',
  templateUrl: './list-diff.component.html',
  standalone: false,
})
export class ListDiffComponent {
  @Input() public config: ListPropertyConfig;

  public get current() {
    return this.config.object[0]?.[this.config.field]?.join('; ') || '';
  }
  public get previous() {
    return this.config.object[1]?.[this.config.field]?.join('; ') || '';
  }
}
