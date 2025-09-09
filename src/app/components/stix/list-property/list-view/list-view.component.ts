import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ListPropertyConfig } from '../list-property.component';
import { StixTypeToAttackType } from 'src/app/utils/type-mappings';
import { RelatedRef } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ListViewComponent {
  @Input() public config: ListPropertyConfig;

  public get wrap() {
    return this.config.wrap !== undefined ? !!this.config.wrap : true;
  }

  public get showLink() {
    return this.config.showLink ?? false;
  }

  public get tooltip() {
    return this.values
      .map(v =>
        this.config.objectProperty && typeof v === 'object'
          ? v[this.config.objectProperty]
          : v
      )
      .join('; ');
  }

  public get values() {
    if (this.config.field == 'aliases')
      return this.config.object[this.config.field].slice(1); // filter out the first alias
    const arr = this.config.object[this.config.field];
    arr.sort((a, b) => {
      const aVal =
        this.config.objectProperty && typeof a === 'object'
          ? a[this.config.objectProperty]
          : a;
      const bVal =
        this.config.objectProperty && typeof b === 'object'
          ? b[this.config.objectProperty]
          : b;
      return String(aVal).localeCompare(String(bVal));
    });
    return arr;
  }

  public getHTML(val: string | RelatedRef) {
    if (this.config.objectProperty && typeof val === 'object') {
      if (this.showLink) {
        return `<a class="external-link" href="${this.internalLink(val)}" rel="nofollow noopener">${val[this.config.objectProperty]}</a>`;
      }
      return val[this.config.objectProperty];
    }
    return val;
  }

  public internalLink(item: RelatedRef): string {
    const attackType = StixTypeToAttackType[item.type];
    return `/${attackType}/${item.stixId}`;
  }
}
