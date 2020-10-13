import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CollectionService } from 'src/app/services/stix/collection/collection.service';
import { Collection } from 'src/app/classes/stix/collection';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionListComponent implements OnInit {

    public collections: Collection[] = [];
        
    constructor(private collectionService: CollectionService) { }

    ngOnInit() {
        this.collections = this.collectionService.getAll();
    }

}
