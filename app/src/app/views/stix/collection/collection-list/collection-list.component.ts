import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Collection } from 'src/app/classes/stix/collection';

@Component({
    selector: 'app-collection-list',
    templateUrl: './collection-list.component.html',
    styleUrls: ['./collection-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CollectionListComponent implements OnInit {
    @Input() config: CollectionListConfig;
    public filteredCollections: Collection[];
    public collectionMap: Map<string, Collection[]>;
        
    constructor() {
        // intentionally left blank
    }

    ngOnInit() {
      // filter based on editing status
      const hold = this.config.collections.filter((collection) => {
        if (this.config.mode  == 'created'){
          return !collection.imported;
        } else {
          return collection.imported;
        }
      });
      this.collectionMap = new Map();
      for (const collection of hold) {
        // ensure all collections are not editable
        collection.editable = false
        if (this.collectionMap.has(collection.stixID)) {
          // if the key already exists, append to array and sort
          let newArr = this.collectionMap.get(collection.stixID);
          newArr.push(collection);
          newArr.sort((a:Collection,b:Collection)=> b.modified.valueOf() - a.modified.valueOf());
          this.collectionMap.set(collection.stixID, newArr);
        } else {
          // if the key does not exist, add it
          this.collectionMap.set(collection.stixID, [collection]);
        }
      }
      // for created mode, only keep the newest version of each numbered version
      if (this.config.mode == 'created') {
        for(const key of this.collectionMap.keys()){
            const initialArr = this.collectionMap.get(key);
            const uniqueVersionArr:Collection[] = [];
            for (const collection in initialArr) {
              if (uniqueVersionArr.findIndex(element=> element.version == collection.version) == -1) {
                uniqueVersionArr.push(collection)
              } 
            }
            this.collectionMap.set(key, uniqueVersionArr);
        }
      }
      const newFilteredList = [];
      for(const key of this.collectionMap.keys()){
        // only add the newest version to display
        const collection = this.collectionMap.get(key)[0];
        if (this.config.mode=='created') {
          // for created mode, only the newest version is editable
          collection.editable = true;
        }
        newFilteredList.push(collection);
      }
      this.filteredCollections = newFilteredList;
    }

}

export interface CollectionListConfig {
    /**
     * If "imported", show only imported collections
     * if "created", show only created/internal collections
     */
    mode: "imported" | "created";
    // collections from REST API to filter on
    collections: Collection[];
}