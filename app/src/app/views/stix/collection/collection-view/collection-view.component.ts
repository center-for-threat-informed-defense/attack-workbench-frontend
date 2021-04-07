import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { delay, map, switchMap, tap } from 'rxjs/operators';
import { Collection, CollectionDiffCategories, VersionReference } from 'src/app/classes/stix/collection';
import { Group } from 'src/app/classes/stix/group';
import { Matrix } from 'src/app/classes/stix/matrix';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { Relationship } from 'src/app/classes/stix/relationship';
import { Software } from 'src/app/classes/stix/software';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { StixListComponent } from 'src/app/components/stix/stix-list/stix-list.component';
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

    /**
     * Move changes between the potential changes and the collection changes
     * @param {StixObject[]} objects objects to move
     * @param {string} attackType attack type of objects
     * @param {changeCategory} category the category, e.g additions
     * @param {("stage" | "unstage")} direction stage moves to collectionChanges, unstage moves to potentialChanges
     * @param {StixListComponent[]} refs list of stix components to trigger redraws of
     */
    public moveChanges(objects: StixObject[], attackType: string, category: changeCategory, direction: "stage" | "unstage", refs: StixListComponent[]): void {
        // Addition: stage
        if (category == "additions" && direction == "stage") {
            // - Remove from potential additions
            this.potentialChanges[attackType].remove_objects(objects, "additions");
            // - Add to additions
            this.collectionChanges[attackType].add_objects(objects, "additions");
        }

        // Addition: unstage
        else if (category == "additions" && direction == "unstage") {
            // - Add to potential additions
            this.potentialChanges[attackType].add_objects(objects, "additions");
            // - Remove from additions
            this.collectionChanges[attackType].remove_objects(objects, "additions");
        }

        // Change: stage
        else if (category == "changes" && direction == "stage") {
            // - Remove from potential changes
            this.potentialChanges[attackType].remove_objects(objects, "changes");
            // - Remove from unchanged
            this.collectionChanges[attackType].remove_objects(objects, "duplicates");
            // remove from minor changes (upgrade type)
            this.collectionChanges[attackType].remove_objects(objects, "minor_changes");
            // sort object changes into following overwrite categories
            let updates = {
                revocations: [],
                deprecations: [],
                changes: []
            }
            for (let object of objects) {
                // - If object present in revocations, update presence in revocations
                if (this.collectionChanges[attackType].has_object(object, "revocations")) {
                    updates["revocations"].push(object);
                }
                // - Else If object is present in deprecations, update presence in deprecations
                else if (this.collectionChanges[attackType].has_object(object, "deprecations")) {
                    updates["deprecations"].push(object);  
                }
                // - Else update presence /add in changes
                else {
                    updates["changes"].push(object);
                }
            }
            for (let update in updates) {
                this.collectionChanges[attackType].add_objects(updates[update], update);
            }
        }

        // Change: unstage
        else if (category == "changes" && direction == "unstage") {
            // - Add to potential changes
            this.potentialChanges[attackType].add_objects(objects, "changes");
            // - Add to unchanged
            this.collectionChanges[attackType].add_objects(objects, "duplicates");
            // - Remove from changes
            this.collectionChanges[attackType].remove_objects(objects, "changes");
        }

        // Minor Change: stage
        else if (category == "minor_changes" && direction == "stage") {
            // - Remove from potential minor changes
            this.potentialChanges[attackType].remove_objects(objects, "minor_changes");
            // - Remove from unchanged
            this.collectionChanges[attackType].remove_objects(objects, "duplicates");
            // sort object changes into following overwrite categories
            let updates = {
                revocations: [],
                deprecations: [],
                changes: [],
                minor_changes: []
            }
            for (let object of objects) {
                // - If object present in revocations, update presence in revocations
                if (this.collectionChanges[attackType].has_object(object, "revocations")) {
                    updates["revocations"].push(object);
                }
                // - Else If object is present in deprecations, update presence in deprecations
                else if (this.collectionChanges[attackType].has_object(object, "deprecations")) {
                    updates["deprecations"].push(object);  
                }
                // - Else If object present in changes, update presence in changes
                else if (this.collectionChanges[attackType].has_object(object, "changes")) {
                    updates["changes"].push(object);  
                }
                // - Else update presence /add in minor changes
                else {
                    updates["minor_changes"].push(object);  
                }
            }
            for (let update in updates) {
                this.collectionChanges[attackType].add_objects(updates[update], update);
            }
        }

        // Minor Change: unstage
        else if (category == "minor_changes" && direction == "unstage") {
            // - Remove from minor changes
            this.collectionChanges[attackType].remove_objects(objects, "minor_changes");
            // - Add to potential minor changes
            this.potentialChanges[attackType].add_objects(objects, "minor_changes");
            // - Add to unchanged
            this.collectionChanges[attackType].add_objects(objects, "duplicates");
        }

        // Revocation: stage
        else if (category == "revocations" && direction == "stage") {
            // - Remove from potential revocations
            this.potentialChanges[attackType].remove_objects(objects, "revocations");
            // - Remove from unchanged
            this.collectionChanges[attackType].remove_objects(objects, "duplicates");
            // - If object present in changes, remove presence from changes
            this.collectionChanges[attackType].remove_objects(objects, "changes");
            // - Else If object is present in minor changes, remove presence from minor changes
            this.collectionChanges[attackType].remove_objects(objects, "minor_changes");
            // - Add to revocations
            this.collectionChanges[attackType].add_objects(objects, "revocations");
        }

        // Revocation: unstage
        else if (category == "revocations" && direction == "unstage") {
            // - Remove from revocations
            this.collectionChanges[attackType].remove_objects(objects, "revocations");
            // - Add to potential revocations
            this.potentialChanges[attackType].add_objects(objects, "revocations");
            // - Add to unchanged
            this.collectionChanges[attackType].add_objects(objects, "duplicates");
        }

        // Deprecation: stage
        else if (category == "deprecations" && direction == "stage") {
            // - Remove from potential deprecations
            this.potentialChanges[attackType].remove_objects(objects, "deprecations");
            // - Remove from unchanged
            this.collectionChanges[attackType].remove_objects(objects, "duplicates");
            // - If object present in changes, remove presence from changes
            this.collectionChanges[attackType].remove_objects(objects, "changes");
            // - Else If object is present in minor changes, remove presence from minor changes
            this.collectionChanges[attackType].remove_objects(objects, "minor_changes");
            // - Add to deprecations
            this.collectionChanges[attackType].add_objects(objects, "deprecations");
        }

        // Deprecation: unstage
        else if (category == "deprecations" && direction == "unstage") {
            // - Remove from deprecations
            this.collectionChanges[attackType].remove_objects(objects, "deprecations");
            // - Add to potential deprecations
            this.potentialChanges[attackType].add_objects(objects, "deprecations");
            // - Add to unchanged
            this.collectionChanges[attackType].add_objects(objects, "duplicates");

        }

        // after any update, update the lists
        setTimeout(() => { //update lists after a render cycle
            for (let ref of refs) {
                ref.applyControls();
            }
        })
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.editing = params["editing"];
        });
        this.loading = "fetching additional data";
        // fetch previous collection and objects in knowledge base
        let subscription = forkJoin({
            "attackObjects": this.restApiConnector.getAllObjects(null, null, null, null, true, true, false),
            "previousRelease": this.restApiConnector.getCollection(this.collection.stixID, null, "all", false).pipe(
                switchMap((collections) => {
                    // get the most recent version which was released for comparison
                    let last_version = collections.find((collection) => !collection.workflow || !collection.workflow.state || collection.workflow.state as string == "published")
                    return this.restApiConnector.getCollection(this.collection.stixID, last_version.modified, "latest", null, true).pipe(
                        map((full_collection) => full_collection[0])
                    );
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
