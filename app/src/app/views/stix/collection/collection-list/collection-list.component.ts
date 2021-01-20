import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Collection } from 'src/app/classes/stix/collection';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionListComponent implements OnInit {

    public collections: Collection[] = [];
        
    constructor() { }

    ngOnInit() {}

}
