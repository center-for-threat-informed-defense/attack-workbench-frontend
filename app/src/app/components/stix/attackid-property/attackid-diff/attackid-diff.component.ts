import { Component, Input } from '@angular/core';
import { AttackIDPropertyConfig } from '../attackid-property.component';

@Component({
  selector: 'app-attackid-diff',
  templateUrl: './attackid-diff.component.html'
})
export class AttackidDiffComponent {
  @Input() public config: AttackIDPropertyConfig;

  public get before(): string { return this.config.object[0]?.['attackID']; }

  public get after(): string { return this.config.object[1]?.['attackID']}


}
