import { Component, Input } from '@angular/core';
import { DescriptivePropertyConfig } from '../descriptive-property.component';

@Component({
  selector: 'app-descriptive-diff',
  templateUrl: './descriptive-diff.component.html'
})
export class DescriptiveDiffComponent {
  @Input() public config: DescriptivePropertyConfig;

  public get before() { return this.config.object[0]?.[this.config.field]}
  public get after() { return this.config.object[1]?.[this.config.field]}
}
