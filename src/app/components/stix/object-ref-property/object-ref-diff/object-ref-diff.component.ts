import { Component, Input, OnInit } from '@angular/core';
import { ObjectRefPropertyConfig } from '../object-ref-property.component';
import { StixObject } from 'src/app/classes/stix';

@Component({
  selector: 'app-object-ref-diff',
  templateUrl: './object-ref-diff.component.html',
  standalone: false,
})
export class ObjectRefDiffComponent implements OnInit {
  @Input() public config: ObjectRefPropertyConfig;
  @Input() public attackObjects: StixObject[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public refTable: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public fields: any[];

  public get fieldDefs(): string[] {
    return this.fields.map(f => f.field);
  }
  public get current() {
    return this.config.object[0]?.[this.config.field] || [];
  }
  public get previous() {
    return this.config.object[1]?.[this.config.field] || [];
  }

  ngOnInit(): void {
    this.refTable = this.mergeTable();
    const refField = {
      ...this.config.objectRefField,
      isRefField: true,
    };
    this.fields = [refField, ...this.config.relatedFields];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mergeTable(): any[] {
    const merged = new Map();

    // add before state
    this.previous.forEach(item =>
      merged.set(item.ref, { before: item, after: null })
    );

    // add after state
    for (const item of this.current) {
      if (merged.has(item.ref)) merged.get(item.ref).after = item;
      else merged.set(item.ref, { before: null, after: item });
    }

    return Array.from(merged.values());
  }

  public fieldToString(item, columnName) {
    if (!item?.[columnName]) return '';
    if (Array.isArray(item[columnName])) return item[columnName].join('; ');
    return item[columnName];
  }

  /**
   * Get the ATT&CK ID for the given object
   * @param {string} stixID obj stix ID
   */
  public getAttackId(item, columnName): string {
    if (!item?.[columnName]) return '';
    const stixID = item[columnName];
    return (
      this.attackObjects?.find(o => o.stixID === stixID)?.attackID ??
      '<attackID not found>'
    );
  }
}
