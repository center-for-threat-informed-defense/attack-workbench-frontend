import { Component, Input } from '@angular/core';
import { CitationPropertyConfig } from '../citation-property.component';

@Component({
  selector: 'app-citation-diff',
  templateUrl: './citation-diff.component.html'
})
export class CitationDiffComponent {
  @Input() public config: CitationPropertyConfig;

  public get before(): string { return this.config.object[0]?.[this.config.field]; }
  
  public get after(): string { return this.config.object[1]?.[this.config.field]; }
}
