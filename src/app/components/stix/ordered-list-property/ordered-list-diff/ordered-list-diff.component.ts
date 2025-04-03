import { Component, Input } from '@angular/core';
import { OrderedListPropertyConfig } from '../ordered-list-property.component';

@Component({
  selector: 'app-ordered-list-diff',
  templateUrl: './ordered-list-diff.component.html',
})
export class OrderedListDiffComponent {
  @Input() public config: OrderedListPropertyConfig;
  private _idToLabel: Map<string, string>;

  public get current() {
    const list =
      this.config.object[0]?.[this.config.objectOrderedListField] || [];
    return list.map(tid => this.getLabel(tid)).join('; ');
  }
  public get previous() {
    const list =
      this.config.object[1]?.[this.config.objectOrderedListField] || [];
    return list.map(tid => this.getLabel(tid)).join('; ');
  }

  /**
   * Get a human readable label for the given object
   * @param {string} stixID the stix ID to get
   */
  private getLabel(stixID: string): string {
    if (!this._idToLabel) {
      this._idToLabel = new Map();
      for (const object of this.config.globalObjects) {
        this._idToLabel.set(object.stixID, object[this.config.field]);
      }
    }
    return this._idToLabel.get(stixID);
  }
}
