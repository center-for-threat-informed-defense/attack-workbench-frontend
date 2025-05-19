import { Component, Input } from '@angular/core';
import { TlpPropertyConfig } from '../tlp-property.component';

@Component({
  selector: 'app-tlp-diff',
  templateUrl: './tlp-diff.component.html',
  styleUrl: './tlp-diff.component.scss',
  standalone: false,
})
export class TlpDiffComponent {
  @Input() public config: TlpPropertyConfig;
  @Input() public tlpMarkingDefinitionsMap: any;

  public get current(): string {
    const markingRefs: any[] =
      this.config.object[0]?.['object_marking_refs'] || [];
    for (const stixId of markingRefs) {
      if (stixId in this.tlpMarkingDefinitionsMap)
        return this.tlpMarkingDefinitionsMap[stixId].definition_string;
    }
    return 'none';
  }
  public get previous(): string {
    const markingRefs: any[] =
      this.config.object[1]?.['object_marking_refs'] || [];
    for (const stixId of markingRefs) {
      if (stixId in this.tlpMarkingDefinitionsMap)
        return this.tlpMarkingDefinitionsMap[stixId].definition_string;
    }
    return 'none';
  }

  public tlpClass(): string {
    if (this.current == 'red') return 'tlp-red';
    else if (this.current == 'amber') return 'tlp-amber';
    else if (this.current == 'green') return 'tlp-green';
    else if (this.current == 'white') return 'tlp-white';
    else return '';
  }

  public tlpChangeIndicator(): string {
    const levels = ['none', 'white', 'green', 'amber', 'red'];
    const curr = levels.indexOf(this.current || 'none');
    const prev = levels.indexOf(this.previous || 'none');
    if (curr > prev) return 'arrow_drop_up';
    else if (curr < prev) return 'arrow_drop_down';
    return ''; // no change
  }

  public getTooltip(): string {
    if (this.current == this.previous) return '';

    const change = this.tlpChangeIndicator();
    return `${change == 'arrow_drop_up' ? 'increased' : 'decreased'} from TLP: ${this.previous.toUpperCase()}`;
  }
}
