import { Component, Input } from '@angular/core';
import { CitationPropertyConfig } from '../citation-property.component';

@Component({
  selector: 'app-citation-diff',
  templateUrl: './citation-diff.component.html',
})
export class CitationDiffComponent {
  @Input() public config: CitationPropertyConfig;

  public get current(): string {
    return this.config.object[0]?.[this.config.field] || '';
  }
  public get previous(): string {
    return this.config.object[1]?.[this.config.field] || '';
  }
}
