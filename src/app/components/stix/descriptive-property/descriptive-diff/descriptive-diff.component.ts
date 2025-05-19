import { Component, Input } from '@angular/core';
import { DescriptivePropertyConfig } from '../descriptive-property.component';

@Component({
  selector: 'app-descriptive-diff',
  templateUrl: './descriptive-diff.component.html',
  standalone: false,
})
export class DescriptiveDiffComponent {
  @Input() public config: DescriptivePropertyConfig;

  public get current() {
    return this.config.object[0]?.[this.config.field] || '';
  }
  public get previous() {
    return this.config.object[1]?.[this.config.field] || '';
  }
}
