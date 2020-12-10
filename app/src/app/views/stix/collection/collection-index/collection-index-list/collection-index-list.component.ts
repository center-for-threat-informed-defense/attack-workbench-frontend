import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CollectionIndex, exampleCollectionIndexes} from 'src/app/classes/collection-index';

@Component({
  selector: 'app-collection-index-list',
  templateUrl: './collection-index-list.component.html',
  styleUrls: ['./collection-index-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionIndexListComponent implements OnInit {
    // public collectionIndexes: CollectionIndex[] = [exampleCollectionIndex]
    public get exampleCollectionIndexes() { return exampleCollectionIndexes; }
    constructor() { }

    ngOnInit(): void {
    }

}
