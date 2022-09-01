import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { Collection } from 'src/app/classes/stix/collection';
import { Relationship } from 'src/app/classes/stix/relationship';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { VersionNumber } from 'src/app/classes/version-number';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { EditorService } from 'src/app/services/editor/editor.service';
import { StixDialogComponent } from 'src/app/views/stix/stix-dialog/stix-dialog.component';

interface HistoryEvent {
    change_types: {
        versionChanged: boolean; // did the version number change? corresponds to prior_version
        stateChanged: boolean; // did the workflow state change?
        objectCreated: boolean; // was the object created?
        objectImported: boolean; // was the object imported for the first time,
        release: boolean; //for collections, was this a release?
    }
    icon: string; // icon representing the change
    name: string; //name of the object being changed
    description: string; // description of what happened in the event
    sdo: StixObject; // StixObject version corresponding to the event (post-change)
    prior_version?: VersionNumber; // if specified, the version number changed; this field is the prior version number
    prior_state?: string; // if specified, the workflow state changed; this field is the prior workflow state
}

@Component({
  selector: 'app-history-timeline',
  templateUrl: './history-timeline.component.html',
  styleUrls: ['./history-timeline.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HistoryTimelineComponent implements OnInit, OnDestroy {

    public historyEvents: HistoryEvent[];
    public loading: boolean = false;
    public hoveredHistoryEvent: HistoryEvent = null;
    public showObjectHistory: boolean = true;
    public showRelationshipHistory: boolean = true;
    public onEditStopSubscription: Subscription;
    
    

    constructor(private route: ActivatedRoute, 
                private router: Router, 
                private restAPIConnectorService: RestApiConnectorService,
                private dialog: MatDialog,
                private editorService: EditorService) {
                    
        this.onEditStopSubscription = this.editorService.onEditingStopped.subscribe({
            next: () => { this.loadHistory(); }
        })
    }

    /**
     * transform the object versions into HistoryEvent objects and add them to the HistoryEvents array
     */
    private parseHistory(objectVersions: StixObject[], relationships: Relationship[]): void {
        // ensure that the stix objects are sorted in ascending order of date
        objectVersions = objectVersions.sort((a,b) => (a.modified as any) - (b.modified as any)); 
        relationships = relationships.sort((a,b) => (a.modified as any) - (b.modified as any)); 
        // clear previously parsed historyEvents
        this.historyEvents = [];
        // build historyEvents for the object itself
        let previousVersion = null;
        let previousState = null;
        for (let objectVersion of objectVersions) {
            let versionChanged = previousVersion && objectVersion.version.compareTo(previousVersion) != 0;
            let stateChanged = previousState && objectVersion.workflow && objectVersion.workflow.state ? objectVersion.workflow.state != previousState : false;
            let objectCreated = objectVersion.created.getTime() == objectVersion.modified.getTime();
            let release = objectVersion.attackType == "collection" && (objectVersion as Collection).release;
            let objectImported = !objectCreated && !previousVersion;
            let description = objectCreated? `${objectVersion["name"]} was created` : objectImported? `Earliest imported version of ${objectVersion["name"]}` : `${objectVersion["name"]} was edited`
            this.historyEvents.push({
                change_types: {
                    versionChanged: versionChanged,
                    stateChanged: stateChanged,
                    objectImported: objectImported,
                    objectCreated: objectCreated,
                    release: release
                },
                icon: objectImported? "cloud_download" : objectCreated? "add" : "edit",
                name: objectVersion["name"],
                description: description,
                sdo: objectVersion,
                prior_version: versionChanged? previousVersion : null,
                prior_state: stateChanged ? previousState : 'unset'
            })
            previousVersion = objectVersion.version;
            previousState = objectVersion.workflow ? objectVersion.workflow.state : 'unset';
        }

        // group relationships by ID
        let stixIDtoRelVersions = {};
        for (let relationship of relationships) {
            if (relationship.stixID in stixIDtoRelVersions) stixIDtoRelVersions[relationship.stixID].push(relationship);
            else stixIDtoRelVersions[relationship.stixID] = [relationship];
        }

        // build historyEvents for relationships
        for (let relationshipID in stixIDtoRelVersions) {
            let firstVersion = true;
            for (let relationshipVersion of stixIDtoRelVersions[relationshipID]) {
                let objectCreated = relationshipVersion.created.getTime() == relationshipVersion.modified.getTime();
                let objectImported = !objectCreated && firstVersion;
                let relationshipName = `${relationshipVersion.source_name} ${relationshipVersion.relationship_type} ${relationshipVersion.target_name}`
                let description = objectCreated? `${relationshipName} was created` : objectImported? `Earliest imported version of ${relationshipName}` : `${relationshipName} was edited`

                this.historyEvents.push({
                    change_types: {
                        versionChanged: false,
                        stateChanged: false,
                        objectImported: objectImported,
                        objectCreated: objectCreated,
                        release: false
                    },
                    icon: objectImported? "cloud_download" : objectCreated? "add" : "edit",
                    name: relationshipName,
                    description: description,
                    sdo: relationshipVersion,
                })
                firstVersion = false;
            }
        }
        
        this.historyEvents.sort((a,b) => (b.sdo.modified as any) - (a.sdo.modified as any));
    }

    public preview(sdo: StixObject) {
        this.dialog.open(StixDialogComponent, {
            data: {
                object: sdo,
                editable: false,
                sidebarControl: "disable"
            },
            maxHeight: "75vh"
        });
    }

    public loadHistory() {
        this.loading = true;
        let objectType = this.router.url.split("/")[1];
        let objectStixID = this.router.url.split("/")[2].split("?")[0];
        // set up subscribers to get object versions
        let objects$;
        if (objectType == "software") objects$ = this.restAPIConnectorService.getSoftware(objectStixID, null, "all");
        else if (objectType == "group") objects$ = this.restAPIConnectorService.getGroup(objectStixID, null, "all");
        else if (objectType == "matrix") objects$ = this.restAPIConnectorService.getMatrix(objectStixID, null, "all");
        else if (objectType == "mitigation") objects$ = this.restAPIConnectorService.getMitigation(objectStixID, null, "all");
        else if (objectType == "tactic") objects$ = this.restAPIConnectorService.getTactic(objectStixID, null, "all");
        else if (objectType == "campaign") objects$ = this.restAPIConnectorService.getCampaign(objectStixID, null, "all");
        else if (objectType == "technique") objects$ = this.restAPIConnectorService.getTechnique(objectStixID, null, "all");
        else if (objectType == "collection") objects$ = this.restAPIConnectorService.getCollection(objectStixID, null, "all");
        else if (objectType == "data-source") objects$ = this.restAPIConnectorService.getDataSource(objectStixID, null, "all");
        else if (objectType == "data-component") objects$ = this.restAPIConnectorService.getDataComponent(objectStixID, null, "all");
        // set up subscribers to get relationships
        let relationships$ = this.restAPIConnectorService.getRelatedTo({sourceOrTargetRef: objectStixID, versions: "all"});
        // join subscribers
        let subscription = forkJoin({
            objectVersions: objects$,
            relationships: relationships$,
        }).subscribe({
            next: (result) => {
                this.parseHistory(result.objectVersions as StixObject[], result.relationships.data as Relationship[]);
                this.loading = false;
            },
            complete: () => { subscription.unsubscribe() }
        });
    }

    ngOnInit(): void {
        this.loadHistory();
    }

    ngOnDestroy(): void {
        this.onEditStopSubscription.unsubscribe();
    }

}
