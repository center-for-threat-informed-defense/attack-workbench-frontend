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

    constructor() { }

    ngOnInit(): void {
    }

}
