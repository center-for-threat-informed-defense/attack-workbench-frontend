import { Component, Input } from '@angular/core';
import { ListPropertyConfig } from '../list-property.component';

@Component({
  selector: 'app-list-diff',
  templateUrl: './list-diff.component.html'
})
export class ListDiffComponent {
  @Input() public config: ListPropertyConfig;

  public get before() { return this.config.object[0]?.[this.config.field]?.join('; ')}
  public get after() { return this.config.object[1]?.[this.config.field]?.join('; ')}
}
