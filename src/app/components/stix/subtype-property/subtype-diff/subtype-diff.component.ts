import { Component, Input, OnInit } from '@angular/core';
import { SubtypePropertyConfig } from '../subtype-property.component';

@Component({
  selector: 'app-subtype-diff',
  templateUrl: './subtype-diff.component.html',
  standalone: false,
})
export class SubtypeDiffComponent implements OnInit {
  @Input() public config: SubtypePropertyConfig;

  public get current() {
    return this.config.object[0]?.[this.config.field] || [];
  }
  public get previous() {
    return this.config.object[1]?.[this.config.field] || [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public detailTable: any[] = [];

  public get subtypeFields() {
    return this.config.subtypeFields;
  }
  public get fieldLabels(): string[] {
    return this.config.subtypeFields.map(f => (f.label ? f.label : f.name));
  }

  ngOnInit(): void {
    this.detailTable = this.mergeTable();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mergeTable(): any[] {
    const merged = new Map();

    // add before state to map
    this.previous.forEach(item => {
      const key = item.name ? item.name : item.field;
      merged.set(key, { before: item, after: null });
    });

    // add after state to map
    for (const item of this.current) {
      const key = item.name ? item.name : item.field;
      if (merged.has(key)) merged.get(key).after = item;
      else merged.set(key, { before: null, after: item });
    }

    return Array.from(merged.values());
  }

  public fieldToString(item, columnName) {
    if (!item?.[columnName]) return '';
    if (Array.isArray(item[columnName])) return item[columnName].join('; ');
    return item[columnName];
  }
}
