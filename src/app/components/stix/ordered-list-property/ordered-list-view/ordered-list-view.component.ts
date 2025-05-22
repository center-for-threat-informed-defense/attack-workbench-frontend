import { Component, Input, ViewEncapsulation } from '@angular/core';
import { OrderedListPropertyConfig } from '../ordered-list-property.component';

@Component({
  selector: 'app-ordered-list-view',
  templateUrl: './ordered-list-view.component.html',
  styleUrls: ['./ordered-list-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class OrderedListViewComponent {
  @Input() public config: OrderedListPropertyConfig;
  private _idToLabel: Map<string, string>;

  constructor() {
    // intentionally left blank
  }

  /**
   * Get a human readable label for the given object
   *
   * @param {string} stixID the stix ID to get
   */
  public getLabel(stixID: string): string {
    if (!this._idToLabel) {
      this._idToLabel = new Map();
      for (const object of this.config.globalObjects) {
        this._idToLabel.set(object.stixID, object[this.config.field]);
      }
    }
    return this._idToLabel.get(stixID);
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
