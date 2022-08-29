import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { Technique } from 'src/app/classes/stix/technique';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
    selector: 'app-collection-update-dialog',
    templateUrl: './collection-update-dialog.component.html',
    styleUrls: ['./collection-update-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CollectionUpdateDialogComponent implements OnInit {
    public stage: number = 0;
    public tacticsToAdd: StixObject[] = [];

    constructor(public dialogRef: MatDialogRef<CollectionUpdateDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public config: CollectionUpdateConfig,
                public restApiService: RestApiConnectorService) {
        // intentionally left blank
    }

    ngOnInit(): void {
        this.loadObjects();
    }

    /**
     * Find tactic objects referenced by techniques in the collection
     */
    private loadObjects(): void {
        // get tactics related to techniques
        let techniques: Technique[] = this.config.collectionChanges.technique.flatten();
        let api_calls = [];
        for (let technique of techniques) {
            // api_calls.push(this.restApiService.getTacticsRelatedToTechnique(technique.stixID));
            api_calls.push(technique.stixID);
        }
        let objSubscription = forkJoin(api_calls).subscribe({
            next: (results) => {
                // filter out tactics already added to the collection
                // let staged_tactics = this.config.collectionChanges.tactic.flatten();
                // let staged_tactic_ids: string[] = staged_tactics.map(t => t.stixID);
                // results = results.filter(t => !staged_tactic_ids.includes(t.stixID));

                // add tactics to list and enter reviewing stage
                // this.tacticsToAdd.push(...results);
                this.stage = 1;
            },
            complete: () => objSubscription.unsubscribe()
        });
    }

    public update(): void {
        // enter updating stage
        this.stage = 2;
        for (let object of this.tacticsToAdd) {
            // get the change type category the object is found in
            let changeType = this.getChangeType(object);
            if (changeType) {
                // add objects to collection
                this.config.collectionChanges.tactic.add_objects(this.tacticsToAdd, changeType);
                // remove objects from potential changes
                this.config.potentialChanges.tactic.remove_objects(this.tacticsToAdd, changeType);
            }
        }
        this.dialogRef.close(true);
    }

    public getChangeType(object: StixObject): string {
        for (let change_type in this.config.potentialChanges.tactic) {
            if (this.config.potentialChanges.tactic.has_object(object, change_type)) {
                return change_type;
            }
        }
        return null;
    }
}

export interface CollectionUpdateConfig {
    collectionChanges: any;
    potentialChanges: any;
}