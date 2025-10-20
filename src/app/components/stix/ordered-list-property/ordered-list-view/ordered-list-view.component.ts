import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { OrderedListPropertyConfig } from '../ordered-list-property.component';
import { StixObject } from 'src/app/classes/stix';

@Component({
  selector: 'app-ordered-list-view',
  templateUrl: './ordered-list-view.component.html',
  styleUrls: ['./ordered-list-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class OrderedListViewComponent implements OnInit {
  @Input() public config: OrderedListPropertyConfig;
  private _idToObject: Map<string, StixObject>;

  ngOnInit(): void {
    if (!this._idToObject) {
      this._idToObject = new Map();
      for (const object of this.config.globalObjects) {
        this._idToObject.set(object.stixID, object);
      }
    }
  }

  /**
   * Get a human readable label for the given object
   *
   * @param {string} stixID the stix ID to get
   */
  public getLabel(stixID: string): string {
    return this._idToObject.get(stixID)[this.config.field];
  }

  public getTooltip(stixID: string): string {
    if (!this.config.tooltipField) return '';
    const tooltip =
      this._idToObject.get(stixID)?.[this.config.tooltipField] ?? '';
    if (!tooltip) return '';
    return `${this.config.tooltipLabel ? this.config.tooltipLabel + ': ' : ''}${tooltip}`;
  }

  /**
   * retrieve the internal link to the object
   *
   * @param {string} stixID the stix ID to get
   */
  public internalLink(stixID: string): string {
    return `/${this.config.type}/${stixID}`;
  }

  /**
   * retrieve the ordered list of ids
   */
  public get list(): string[] {
    return this.config.object[this.config.objectOrderedListField];
  }
}
