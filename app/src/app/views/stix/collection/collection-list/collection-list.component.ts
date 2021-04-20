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
        
    constructor() {}

    ngOnInit() {
        if (this.config.mode == "imported") {
            // show imported collections
            this.filteredCollections = this.config.collections.filter(collection => collection.imported);
        } else if (this.config.mode == "created") {
            // get list of collections that were not imported (were created by the user)
            let createdCollections = this.config.collections.filter(collection => !collection.imported);
            let idToCollections = new Map<string, Collection[]>();
            for (let collection of createdCollections) {
                collection.editable = false; //all but last version of each release are not editable (see below for handing of last version)
                if (idToCollections.has(collection.stixID)) { //update
                    let values = idToCollections.get(collection.stixID);
                    values.push(collection);
                    idToCollections.set(collection.stixID, values)
                } else { //set
                    idToCollections.set(collection.stixID, [collection])
                }
            }
            // for each collection, reduce to releases and most recent modified version
            this.filteredCollections = [];
            for (let collectionID of idToCollections.keys()) {
                let versions = idToCollections.get(collectionID);
                versions.sort((a,b) => a.modified.toISOString().localeCompare(b.modified.toISOString())); //sort by modified date
                this.filteredCollections = this.filteredCollections.concat(versions.filter(x => x.release)) // add all released collections
                if (!versions[versions.length - 1].release) {
                    // if most recent version is not a release, add it as well
                    this.filteredCollections.push(versions[versions.length - 1]) //push most recently modified version assuming it hasn't been pushed already
                }
                this.filteredCollections[this.filteredCollections.length - 1].editable = true; //last version of each collection is editable
            }
        }
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