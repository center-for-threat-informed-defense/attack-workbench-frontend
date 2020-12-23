import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CollectionIndex } from 'src/app/classes/collection-index';

@Component({
  selector: 'app-collection-index-view',
  templateUrl: './collection-index-view.component.html',
  styleUrls: ['./collection-index-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionIndexViewComponent implements OnInit {
    @Input() config: CollectionIndexViewConfig;

    public get showActions(): boolean {
        return !this.config.hasOwnProperty("show_actions") || this.config.show_actions;
    }

    constructor() { }

    ngOnInit(): void {
    }

}
export interface CollectionIndexViewConfig {
    // the index to show
    index: CollectionIndex;
    // default false. If true, show the collection title in the component
    show_title: boolean;
    // default true. If false, hides subscribe actions from the component
    show_actions: boolean;
}