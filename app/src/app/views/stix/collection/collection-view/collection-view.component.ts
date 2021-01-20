import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Collection, CollectionImportCategories } from 'src/app/classes/stix/collection';
import { Group } from 'src/app/classes/stix/group';
import { Matrix } from 'src/app/classes/stix/matrix';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { Relationship } from 'src/app/classes/stix/relationship';
import { Software } from 'src/app/classes/stix/software';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { StixViewPage } from '../../stix-view-page';

@Component({
  selector: 'app-collection-view',
  templateUrl: './collection-view.component.html',
  styleUrls: ['./collection-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionViewComponent extends StixViewPage implements OnInit {
    
    public get collections(): Collection[] { return this.config.object as Collection[]; }
    public currentCollection: number = 0;

    public collection_import_categories = []

    constructor(private route: ActivatedRoute) { super() }

    ngOnInit() {
        // parse collection into object_import_categories
        for (let collection of this.collections) {
            let categories = {
                technique:    new CollectionImportCategories<Technique>(),
                tactic:       new CollectionImportCategories<Tactic>(),
                software:     new CollectionImportCategories<Software>(),
                relationship: new CollectionImportCategories<Relationship>(),
                mitigation:   new CollectionImportCategories<Mitigation>(),
                matrix:       new CollectionImportCategories<Matrix>(),
                group:        new CollectionImportCategories<Group>()
            }

            //build category lookup
            let idToCategory = {};
            for (let category in collection.import_categories) {
                for (let stixId of collection.import_categories[category]) idToCategory[stixId] = category;
            }

            //build ID to name lookup
            let idToName = {};
            for (let object of collection.stix_contents) {
                let x = object as any;
                if (object.type != "relationship") idToName[object.stixID] = x.name;
            }
            //parse objects into categories
            for (let object of collection.stix_contents) {
                if (!(object.stixID in idToCategory)) {
                    // does not belong to a change category
                    continue;
                }
                let category = idToCategory[object.stixID];
                switch (object.type) {
                    case "attack-pattern": //technique
                        categories.technique[category].push(object);
                    break;
                    case "x-mitre-tactic": //tactic
                        categories.tactic[category].push(object);
                    break;
                    case "malware": //software
                    case "tool": 
                        categories.software[category].push(object);
                    break;
                    case "relationship": //relationship
                        let x = object as Relationship;
                        x.source_name = x.source_ref in idToName? idToName[x.source_ref] : "unknown object";
                        x.target_name = x.target_ref in idToName? idToName[x.target_ref] : "unknown object";
                        categories.relationship[category].push(object);
                    break;
                    case "course-of-action": //mitigation
                        categories.mitigation[category].push(object);
                    break;
                    case "x-mitre-matrix": //matrix
                        categories.matrix[category].push(object);
                    break;
                    case "intrusion-set": //group
                        categories.group[category].push(object);
                    break;
                }
            }



            this.collection_import_categories.push(categories);
        }
    }

}
