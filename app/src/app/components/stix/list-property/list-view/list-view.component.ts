import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ListPropertyConfig } from '../list-property.component';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListViewComponent implements OnInit {
    @Input() public config: ListPropertyConfig;

    public get wrap() {
        return this.config.hasOwnProperty('wrap') ? this.config.wrap : true;
    }

    constructor() {
        // intentionally left blank
    }
    public get values() {
        if (this.config.field == "aliases") return this.config.object[this.config.field].slice(1); // filter out the first alias
        return this.config.object[this.config.field];
    }

    ngOnInit(): void {
        // intentionally left blank
    }
}
