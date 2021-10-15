import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Collection, CollectionDiffCategories } from 'src/app/classes/stix/collection';
import { Group } from 'src/app/classes/stix/group';
import { Matrix } from 'src/app/classes/stix/matrix';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { Relationship } from 'src/app/classes/stix/relationship';
import { Software } from 'src/app/classes/stix/software';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { DataSource } from 'src/app/classes/stix/data-source';
import { DataComponent } from 'src/app/classes/stix/data-component';
import { EditorService } from 'src/app/services/editor/editor.service';
import { StixViewPage } from '../../../stix-view-page';
import { logger } from "../../../../../util/logger";

@Component({
    selector: 'app-collection-import-review',
    templateUrl: './collection-import-review.component.html',
    styleUrls: ['./collection-import-review.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CollectionImportReviewComponent extends StixViewPage implements OnInit {

   
    public get collection(): Collection { return this.config.object as Collection; }

    public collection_import_categories = {
        technique:      new CollectionDiffCategories<Technique>(),
        tactic:         new CollectionDiffCategories<Tactic>(),
        software:       new CollectionDiffCategories<Software>(),
        relationship:   new CollectionDiffCategories<Relationship>(),
        mitigation:     new CollectionDiffCategories<Mitigation>(),
        matrix:         new CollectionDiffCategories<Matrix>(),
        group:          new CollectionDiffCategories<Group>(),
        data_source:    new CollectionDiffCategories<DataSource>(),
        data_component: new CollectionDiffCategories<DataComponent>()
    }

    constructor(private route: ActivatedRoute, public editor: EditorService) { super() }

    ngOnInit() {
        // disable editing
        this.editor.editable = false;
        // parse collection into object_import_categories
        
        //build category lookup
        let idToCategory = {};
        for (let category in this.collection.import_categories) {
            for (let stixId of this.collection.import_categories[category]) idToCategory[stixId] = category;
        }

        //build ID to SDO
        let idToSdo = {};
        for (let object of this.collection.stix_contents) {
            let x = object as any;
            if (object.type != "relationship") idToSdo[object.stixID] = x.serialize();
        }
        //parse objects into categories
        for (let object of this.collection.stix_contents) {
            if (!(object.stixID in idToCategory)) {
                // does not belong to a change category
                continue;
            }
            let category = idToCategory[object.stixID];
            switch (object.type) {
                case "attack-pattern": //technique
                    this.collection_import_categories.technique[category].push(object);
                break;
                case "x-mitre-tactic": //tactic
                    this.collection_import_categories.tactic[category].push(object);
                break;
                case "malware": //software
                case "tool": 
                    this.collection_import_categories.software[category].push(object);
                break;
                case "relationship": //relationship
                    let x = object as Relationship;
                    // add source and target objects
                    let serialized = x.serialize();
                    serialized.workspace.workflow = {};
                    if (x.source_ref in idToSdo) serialized.source_object = idToSdo[x.source_ref]
                    if (x.target_ref in idToSdo) serialized.target_object = idToSdo[x.target_ref]
                    this.collection_import_categories.relationship[category].push(new Relationship(serialized));
                break;
                case "course-of-action": //mitigation
                    this.collection_import_categories.mitigation[category].push(object);
                break;
                case "x-mitre-matrix": //matrix
                    this.collection_import_categories.matrix[category].push(object);
                break;
                case "intrusion-set": //group
                    this.collection_import_categories.group[category].push(object);
                break;
                case "x-mitre-data-source": // data source
                    this.collection_import_categories.data_source[category].push(object);
                break;
                case "x-mitre-data-component": // data component
                    this.collection_import_categories.data_component[category].push(object);
                break;
            }
        }
        logger.log(this.collection_import_categories);
    }

}
