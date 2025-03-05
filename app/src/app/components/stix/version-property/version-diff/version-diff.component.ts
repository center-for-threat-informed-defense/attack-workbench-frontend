import { Component, Input } from '@angular/core';
import { VersionPropertyConfig } from '../version-property.component';

@Component({
  selector: 'app-version-diff',
  templateUrl: './version-diff.component.html'
})
export class VersionDiffComponent {
  @Input() public config: VersionPropertyConfig;

  public get field(): string { return this.config.field ? this.config.field : 'version'; }
  public get current(): string { return this.config.object[0]?.[this.field]?.version || ''; }
  public get previous(): string { return this.config.object[1]?.[this.field]?.version || ''; }
}
