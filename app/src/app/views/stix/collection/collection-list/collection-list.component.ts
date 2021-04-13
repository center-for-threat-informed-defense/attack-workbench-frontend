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
            this.filteredCollections = this.config.collections.filter(collection => collection.imported);
        } else if (this.config.mode == "created") {
            let createdCollections = this.config.collections.filter(collection => !collection.imported);
            console.log(createdCollections);
            let idToCollections = new Map<string, Collection[]>();
            for (let collection of createdCollections) {
                if (idToCollections.has(collection.stixID)) { //update
                    let values = idToCollections.get(collection.stixID);
                    values.push(collection);
                    idToCollections.set(collection.stixID, values)
                } else { //set
                    idToCollections.set(collection.stixID, [collection])
                }
            }
            console.log(idToCollections);
            // for each collection, reduce to releases and most recent modified version
            this.filteredCollections = [];
            for (let collectionID of idToCollections.keys()) {
                let versions = idToCollections.get(collectionID);
                versions.sort((a,b) => a.modified.toISOString().localeCompare(b.modified.toISOString())); //sort by modified
                this.filteredCollections = this.filteredCollections.concat(versions.filter(x => x.workflow && x.workflow.state == "reviewed")) // add all reviewed collections
                console.log(versions[versions.length - 1])
                if (!versions[versions.length - 1].workflow || versions[versions.length - 1].workflow.state != "reviewed") {
                    console.log("adding most recent modified version")
                    this.filteredCollections.push(versions[versions.length - 1]) //push most recently modified version assuming it hasn't been pushed already
                }
            }
            console.log(this.filteredCollections)
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