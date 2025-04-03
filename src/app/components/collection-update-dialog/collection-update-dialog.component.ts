import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-collection-update-dialog',
  templateUrl: './collection-update-dialog.component.html',
  styleUrls: ['./collection-update-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CollectionUpdateDialogComponent implements OnInit {
  public stage = 0;
  public tacticsToAdd: StixObject[] = [];

  constructor(
    public dialogRef: MatDialogRef<CollectionUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public config: CollectionUpdateConfig,
    public restApiService: RestApiConnectorService
  ) {
    // intentionally left blank
  }

  ngOnInit(): void {
    this.loadObjects();
  }

  /**
   * Retrieve tactic objects referenced by techniques in the collection, filter out
   * duplicate tactics and tactics already in the collection, then add them
   * to the list of objects to add
   */
  private loadObjects(): void {
    // get tactics related to techniques
    const techniques: Technique[] =
      this.config.collectionChanges.technique.flatten(true);
    const api_calls = [];
    techniques.forEach(t =>
      api_calls.push(
        this.restApiService.getTacticsRelatedToTechnique(t.stixID, t.modified)
      )
    );
    if (!api_calls.length) {
      this.stage = 1;
      return;
    } // no techniques found in collection, move to next stage
    const objSubscription = forkJoin(api_calls).subscribe({
      next: results => {
        // merge the results of forkJoin
        let tactics: Tactic[] = [];
        results.forEach((arr: Tactic[]) => {
          tactics.push(...arr);
        });

        // filter out duplicates and tactics already in the collection
        const staged_tactics =
          this.config.collectionChanges.tactic.flatten(true);
        const staged_tactic_ids: string[] = staged_tactics.map(t => t.stixID); // list of tactic stixIDs already in collection
        tactics = tactics.filter((tactic, index, self) => {
          return (
            index === self.findIndex(t => tactic.stixID === t.stixID) &&
            !staged_tactic_ids.includes(tactic.stixID)
          );
        });

        // add tactics to list and enter reviewing stage
        this.tacticsToAdd.push(...tactics);
        this.stage = 1;
      },
      complete: () => objSubscription.unsubscribe(),
    });
  }

  /**
   * Add all objects to collection and update the collection view
   */
  public update(): void {
    // enter updating stage
    this.stage = 2;
    for (const object of this.tacticsToAdd) {
      // get the change type category the object is found in
      const changeType = this.getChangeType(object);
      if (changeType) {
        // add objects to collection
        this.config.collectionChanges.tactic.add_objects(
          this.tacticsToAdd,
          changeType
        );
        // remove objects from potential changes
        this.config.potentialChanges.tactic.remove_objects(
          this.tacticsToAdd,
          changeType
        );
      }
    }
    this.dialogRef.close(true); // trigger reinitialization stix lists in collection view
  }

  /**
   * Get the name of the collection category (change type) the given object exists in
   * @param {StixObject} object the object to find
   * @returns {string} the name of the change type structure the object exists in (see CollectionDiffCategories class)
   */
  public getChangeType(object: StixObject): string {
    for (const change_type in this.config.potentialChanges.tactic) {
      if (this.config.potentialChanges.tactic.has_object(object, change_type)) {
        return change_type;
      }
    }
    return null;
  }
}

export interface CollectionUpdateConfig {
  // set of CollectionDiffCategories which contain objects in the collection
  collectionChanges: any;
  // set of CollectionDiffCategories which contain objects NOT in the collection
  potentialChanges: any;
}
