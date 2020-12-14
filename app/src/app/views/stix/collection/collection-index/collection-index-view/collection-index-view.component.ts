import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CollectionIndex } from 'src/app/classes/collection-index';

@Component({
  selector: 'app-collection-index-view',
  templateUrl: './collection-index-view.component.html',
  styleUrls: ['./collection-index-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionIndexViewComponent implements OnInit {
    @Input() index: CollectionIndex;
    @Input() show_title: boolean = false; //if true,
    @Input() config: CollectionIndexViewConfig;

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