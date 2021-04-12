import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { delay, map, switchMap, tap } from 'rxjs/operators';
import { ValidationData } from 'src/app/classes/serializable';
import { Collection, CollectionDiffCategories, VersionReference } from 'src/app/classes/stix/collection';
import { Group } from 'src/app/classes/stix/group';
import { Matrix } from 'src/app/classes/stix/matrix';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { Relationship } from 'src/app/classes/stix/relationship';
import { Software } from 'src/app/classes/stix/software';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { VersionNumber } from 'src/app/classes/version-number';
import { StixListComponent } from 'src/app/components/stix/stix-list/stix-list.component';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { EditorService } from 'src/app/services/editor/editor.service';
import { StixViewPage } from '../../stix-view-page';
import { environment } from "../../../../../environments/environment";
import { MatSnackBar } from '@angular/material/snack-bar';

type changeCategory = "additions" | "changes" | "minor_changes" | "revocations" | "deprecations";

@Component({
  selector: 'app-collection-view',
  templateUrl: './collection-view.component.html',
  styleUrls: ['./collection-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionViewComponent extends StixViewPage implements OnInit {
    public get collection(): Collection { return this.config.object as Collection; }
    public previousRelease: Collection;
    public attackObjects: any[]; //all objects in the knowledge base, unserialized
    public knowledgeBaseCollection: Collection;
    public editingReloadToggle: boolean = true;

    public loading: string = null; // loading message if loading
    public validating: boolean = false;
    public validationData: ValidationData = null;

    public get collectionDownloadURL() {
        return `${environment.integrations.rest_api.url}/collection-bundles/?collectionId=${this.collection.stixID}&collectionModified=${this.collection.modified.toISOString()}`
    }

    public stagedData: VersionReference[] = [];

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


    constructor(private route: ActivatedRoute, private router: Router, private restApiConnector: RestApiConnectorService, private snackbar: MatSnackBar) { super();  }

    /**
     * Trigger collection save behaviors
     *
     * @memberof CollectionViewComponent
     */
    public validate() {
        this.validating = true;
        this.validationData = null;
        let subscription = this.collection.validate(this.restApiConnector).pipe(
            map(results => { // add extra results here
                // check for double increments of version numbers
                
                // build lookup of STIX ID to version number for new collection
                let collectionStixIDToObject = new Map<string, StixObject>()
                for (let attackType in this.collectionChanges) {
                    if (attackType == "relationship") continue;
                    for (let object of this.collectionChanges[attackType].flatten(true)) collectionStixIDToObject.set(object.stixID, object);
                }
                // compare to values in old collection
                if (this.previousRelease) {
                    for (let oldObject of this.previousRelease.stix_contents) {
                        if (collectionStixIDToObject.has(oldObject.stixID)) { //only if was in collection previously
                            let newObject = collectionStixIDToObject.get(oldObject.stixID)
                            let objectName = newObject.hasOwnProperty("name")? newObject["name"] : newObject.stixID;
                            if (newObject.version.compareTo(oldObject.version) < 0) {
                                results.warnings.push({
                                    result: "warning",
                                    field: "version",
                                    message: `Version number of ${objectName} has been decremented (v${oldObject.version.toString()} → v${newObject.version.toString()})`
                                })
                            } else if (newObject.version.isDoubleIncrement(oldObject.version)) {
                                results.warnings.push({
                                    result: "warning",
                                    field: "version",
                                    message: `Version number of ${objectName} has been incremented twice (v${oldObject.version.toString()} → v${newObject.version.toString()})`
                                })
                            }
                        }
                    }
                }

                //stage data for saving
                this.stagedData = [];
                for (let object of collectionStixIDToObject.values()) {
                    this.stagedData.push(new VersionReference({
                        "object_ref": object.stixID,
                        "object_modified": object.modified.toISOString()
                    }));
                }
                let previousRelationships = this.previousRelease? new Map<string, StixObject>(this.previousRelease.stix_contents.filter(x => x.type == "relationship").map(x => [x.stixID, x]))
                                                                : new Map<string, StixObject>(); // empty if there was nothing here previously
                // stage relationships for saving and determine stats
                let relationship_stats = {
                    "new": 0,
                    "updated": 0,
                    "unchanged": 0,
                    "excluded_one": 0,
                    "excluded_both": 0
                }
                for (let relationship of this.attackObjects.filter(x => x.stix.type == "relationship")) {
                    let rel_id = relationship.stix.id;
                    let rel_modified = relationship.stix.modified;
                    if (collectionStixIDToObject.has(relationship.stix.source_ref) && collectionStixIDToObject.has(relationship.stix.target_ref)) {
                        // includes the relationship!
                        this.stagedData.push(new VersionReference({
                            "object_ref": rel_id,
                            "object_modified": rel_modified
                        }));
                        // track stats
                        if (previousRelationships.has(rel_id)) {
                            if ( previousRelationships.get(rel_id).modified.toISOString() != rel_modified) {
                                // new version/updated 
                                relationship_stats.updated++;
                            } else {
                                //same version
                                relationship_stats.unchanged++;
                            }
                        } else {
                            //new relationship
                            relationship_stats.new++;
                        }
                    } else {
                        //missing at least one side
                        if (collectionStixIDToObject.has(relationship.stix.source_ref) || collectionStixIDToObject.has(relationship.stix.target_ref)) {
                            // has at least one side
                            // stats
                            relationship_stats.excluded_one++;
                        } else { //missing both sides
                            relationship_stats.excluded_both++;
                        }
                    }
                }

                // add stats to vaidation
                results.info.push({
                    result: "info",
                    field: "contents",
                    message: `${relationship_stats.new} new relationships were added in this release`
                })
                results.info.push({
                    result: "info",
                    field: "contents",
                    message: `${relationship_stats.updated} relationships were updated in this release`
                })
                results.info.push({
                    result: "info",
                    field: "contents",
                    message: `${relationship_stats.unchanged} relationships were unchanged by this release`
                })
                results.info.push({
                    result: "info",
                    field: "contents",
                    message: `${relationship_stats.excluded_one} relationships had only one attached object in the collection and were therefore excluded`
                })
                results.info.push({
                    result: "info",
                    field: "contents",
                    message: `${relationship_stats.excluded_both} relationships had neither attached objects in the collection and were therefore excluded`
                })
                
                if (this.stagedData.length == 0) results.errors.push({
                    result: "error",
                    field: "contents",
                    message: "collection has no contents"
                })

                //return final results
                return results;
            })
        ).subscribe({
            next: (results) => this.validationData = results,
            complete: () => subscription.unsubscribe()
        })
    }

    public get saveEnabled() {
        return this.validationData && this.validationData.errors.length == 0;
    }

    public save() {
        this.collection.contents = this.stagedData;
        let subscription = this.collection.save(this.restApiConnector).subscribe({
            next: (result) => {
                this.router.navigate([result.attackType, result.stixID, "modified", result.modified.toISOString()]);
            },
            complete: () => { subscription.unsubscribe(); }
        })
    }

    public downloadCollectionBundle() {
        this.restApiConnector.downloadCollectionBundle(this.collection.stixID, this.collection.modified, `${this.collection.name.toLowerCase().replace(" ", "-")}-${this.collection.version.toString()}.json`);
    }


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
            //reinitialize stix lists in case editing has changed and they have different configs now
            this.editingReloadToggle = false;
            setTimeout(() => this.editingReloadToggle = true); 
        });
        this.loading = "fetching additional data";
        let apis = {
            "attackObjects": this.restApiConnector.getAllObjects(null, null, null, null, true, true, false)
        }
        // fetch previous version if this was not a new collection
        let objectStixID = this.route.snapshot.params["id"];
        if (objectStixID && objectStixID != "new") {
            apis["previousRelease"] = this.restApiConnector.getCollection(this.collection.stixID, null, "all", false).pipe(
                switchMap((collections) => {
                    // get the most recent version which was released for comparison
                    let last_version = collections.find((collection) => !collection.workflow || !collection.workflow.state || collection.workflow.state as string == "published")
                    return this.restApiConnector.getCollection(this.collection.stixID, last_version.modified, "latest", null, true).pipe(
                        map((full_collection) => full_collection[0])
                    );
                })
            )
        }

        // fetch previous collection and objects in knowledge base
        let subscription = forkJoin(apis).pipe(
            tap(_ => { this.loading = "Preparing change lists" }),
            delay(1) // allow render cycle to display loading text
        ).subscribe({
            next: (result) => {
                let anyResult = result as any;
                this.attackObjects = result["attackObjects"];
                if (anyResult.hasOwnProperty("previousRelease")) {
                    this.previousRelease = result["previousRelease"];
                    this.collectionChanges = this.collection.compareTo(this.previousRelease);
                }
                // initialize potentialChanges based off diff of attackObjects vs contents of collection
                // create a "collection" to represent the entire ATT&CK dataset
                this.knowledgeBaseCollection = new Collection( {
                    "stix": {
                        "x_mitre_contents": this.attackObjects.filter(x => x.stix.hasOwnProperty("modified") && x.stix.modified).map(x => { return { object_ref: x.stix.id, object_modified: x.stix.modified } })
                    },
                    "contents": this.attackObjects
                });
                this.potentialChanges = this.knowledgeBaseCollection.compareTo(this.collection);
                this.loading = null;
            },
            complete: () => { subscription.unsubscribe(); }
        })


    }

}
