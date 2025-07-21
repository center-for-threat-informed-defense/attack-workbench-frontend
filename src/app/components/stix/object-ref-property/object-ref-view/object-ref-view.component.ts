import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ObjectRefPropertyConfig } from '../object-ref-property.component';
import { StixObject } from 'src/app/classes/stix';

@Component({
  selector: 'app-object-ref-view',
  templateUrl: './object-ref-view.component.html',
  styleUrl: './object-ref-view.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ObjectRefViewComponent implements OnInit {
  @Input() public config: ObjectRefPropertyConfig;
  @Input() public attackObjects: StixObject[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public refTable: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public fields: any[];

  public get fieldDefs(): string[] {
    return this.fields.map(f => f.field);
  }

  ngOnInit(): void {
    this.refTable = JSON.parse(
      JSON.stringify(this.config.object[this.config.field])
    );
    const refField = {
      ...this.config.objectRefField,
      isRefField: true,
    };
    this.fields = [refField, ...this.config.relatedFields];
  }

  /** Format table columns */
  public format(value): string {
    if (Array.isArray(value)) return value.join('; ');
    return value;
  }

  /**
   * retrieve the internal link to the object
   * @param {string} stixID obj stix ID
   */
  public internalLink(stixID: string): string {
    return `/${this.config.attackType}/${stixID}`;
  }

  /**
   * Get the ATT&CK ID for the given object
   * @param {string} stixID obj stix ID
   */
  public getAttackId(stixID: string): string {
    return this.attackObjects?.find(o => o.stixID === stixID).attackID;
  }
}
