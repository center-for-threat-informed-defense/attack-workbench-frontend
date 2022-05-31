import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { OrderedListPropertyConfig } from '../ordered-list-property.component';

@Component({
  selector: 'app-ordered-list-view',
  templateUrl: './ordered-list-view.component.html',
  styleUrls: ['./ordered-list-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OrderedListViewComponent implements OnInit {
    @Input() public config: OrderedListPropertyConfig;

    constructor() {
        // intentionally left blank
    }

    ngOnInit(): void {
        // intentionally left blank
    }

    private _idToLabel: Map<string, string>;
    /**
     * Get a human readable label for the given object
     *
     * @param {string} id the stix ID to get
     */
    public getLabel(id: string): string {
        if (!this._idToLabel) {
            this._idToLabel = new Map();
            for (let object of this.config.globalObjects) {
                this._idToLabel.set(object.stixID, object[this.config.field]);
            }
        }
        return this._idToLabel.get(id);
    }

    public get list(): string[] {
        return this.config.object[this.config.objectOrderedListField];
    }
}
