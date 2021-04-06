import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Collection, CollectionDiffCategories, VersionReference } from 'src/app/classes/stix/collection';
import { Group } from 'src/app/classes/stix/group';
import { Matrix } from 'src/app/classes/stix/matrix';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { Relationship } from 'src/app/classes/stix/relationship';
import { Software } from 'src/app/classes/stix/software';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixViewPage } from '../../stix-view-page';

type changeCategory = "additions" | "changes" | "minor_changes" | "revocations" | "deprecations";

@Component({
  selector: 'app-collection-view',
  templateUrl: './collection-view.component.html',
  styleUrls: ['./collection-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionViewComponent extends StixViewPage implements OnInit {
    public get collection(): Collection { return this.config.object as Collection; }
    public knowledgeBaseCollection: Collection;
    public editing: boolean = false;
    public page: string = "home";

    public loading: string = null; // loading message if loading

    public potentialChanges = {
        technique:    new CollectionDiffCategories<Technique>(),
        tactic:       new CollectionDiffCategories<Tactic>(),
        software:     new CollectionDiffCategories<Software>(),
        relationship: new CollectionDiffCategories<Relationship>(),
        mitigation:   new CollectionDiffCategories<Mitigation>(),
        matrix:       new CollectionDiffCategories<Matrix>(),
        group:        new CollectionDiffCategories<Group>()
    }

    public collectionChanges = {
        technique:    new CollectionDiffCategories<Technique>(),
        tactic:       new CollectionDiffCategories<Tactic>(),
        software:     new CollectionDiffCategories<Software>(),
        relationship: new CollectionDiffCategories<Relationship>(),
        mitigation:   new CollectionDiffCategories<Mitigation>(),
        matrix:       new CollectionDiffCategories<Matrix>(),
        group:        new CollectionDiffCategories<Group>()
    }

    public collection_import_categories = [];


    constructor(private route: ActivatedRoute, private restApiConnector: RestApiConnectorService) { super();  }

    public stageChanges(refs: VersionReference[], fromCategory: changeCategory, toCategory: changeCategory): void {

    }

    public unstageChanges(refs: VersionReference[], fromCategory: changeCategory, toCategory: changeCategory): void {

    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.editing = params["editing"];
        });
        this.loading = "fetching additional data";
        // fetch previous collection and objects in knowledge base
        let subscription = forkJoin({
            "attackObjects": this.restApiConnector.getAllObjects(null, null, null, null, true, true, false),
            "previousRelease": this.restApiConnector.getCollection(this.collection.stixID, null, "all").pipe(
                map((collections) => {
                    // get the most recent version which was released for comparison
                    return collections.find((collection) => !collection.workflow || !collection.workflow.state || collection.workflow.state as string == "published")
                })
            )
        }).pipe(
            tap(_ => { this.loading = "Preparing change lists" }),
            delay(1) // allow render cycle to display loading text
        ).subscribe({
            next: (result) => {
                this.collectionChanges = this.collection.compareTo(result.previousRelease);
                // initialize potentialChanges based off diff of attackObjects vs contents of collection
                // create a "collection" to represent the entire ATT&CK dataset
                this.knowledgeBaseCollection = new Collection( {
                    "stix": {
                        "x_mitre_contents": result.attackObjects.filter(x => x.stix.hasOwnProperty("modified") && x.stix.modified).map(x => { return { object_ref: x.stix.id, object_modified: x.stix.modified } })
                    },
                    "contents": result.attackObjects
                });
                this.potentialChanges = this.knowledgeBaseCollection.compareTo(this.collection);
                this.loading = null;
            },
            complete: () => { subscription.unsubscribe(); }
        })


    }

}
