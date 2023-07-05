import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Collection, CollectionDiffCategories } from 'src/app/classes/stix/collection';
import { Asset, Campaign, DataComponent, DataSource, Group, Matrix, Mitigation, Relationship, Software, Tactic, Technique } from 'src/app/classes/stix';
import { EditorService } from 'src/app/services/editor/editor.service';
import { StixViewPage } from '../../../stix-view-page';
import { logger } from "../../../../../util/logger";
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';

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
        campaign:       new CollectionDiffCategories<Campaign>(),
        software:       new CollectionDiffCategories<Software>(),
        relationship:   new CollectionDiffCategories<Relationship>(),
        mitigation:     new CollectionDiffCategories<Mitigation>(),
        matrix:         new CollectionDiffCategories<Matrix>(),
        group:          new CollectionDiffCategories<Group>(),
        data_source:    new CollectionDiffCategories<DataSource>(),
        data_component: new CollectionDiffCategories<DataComponent>(),
        asset:          new CollectionDiffCategories<Asset>()
    }

    constructor(private route: ActivatedRoute, public editor: EditorService, authenticationService: AuthenticationService) { super(authenticationService) }

    ngOnInit() {
        // disable editing
        /**
         *  TODO: From Vince and Charissa
         *  This is really wonky since the page load completes and then the editor service is changed, the user can click the edit button while all of the attack objects are loading
         *  Need to find a way to figure out how to tell is a collection is imported earlier on in the chain/disable the toolbar while things are loading
         **/
        
        this.editor.editable = false;
        this.editor.isAnImportedCollection = true;
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
                case "campaign": // campaign
                    this.collection_import_categories.campaign[category].push(object);
                break;
                case "asset": // asset
                    this.collection_import_categories.asset[category].push(object);
                break;
            }
        }
        logger.log(this.collection_import_categories);
    }

}
