import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Collection } from 'src/app/classes/stix/collection';
import { Note } from 'src/app/classes/stix/note';
import { Relationship } from 'src/app/classes/stix/relationship';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { StixDialogComponent } from 'src/app/views/stix/stix-dialog/stix-dialog.component';

interface ActivityEvent {
    icon: string; // icon representing the change
    name: string; // name of the object being changed
    sdo: StixObject; // StixObject version corresponding to the event (post-change)
    object_ref?: StixObject; // StixObject referenced by a Note object
    objectCreated: boolean; // was the object created?
    released: boolean; // for collections, was this a release?
}

@Component({
    selector: 'app-recent-activity',
    templateUrl: './recent-activity.component.html',
    styleUrls: ['./recent-activity.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RecentActivityComponent implements OnInit {
    @Input() public identities: string[]; // list of user IDs
    @Input() public showIdentity: boolean = true;
    public allRecentActivity: ActivityEvent[] = [];
    public recentActivity: ActivityEvent[];
    public loading: boolean = false;
    public hoveredEvent: ActivityEvent = null;

    // Type map for redirections
    private typeMap = {
        "attack-pattern": "technique",
        "x-mitre-tactic": "tactic",
        "intrusion-set": "group",
        "campaign": "campaign",
        "malware": "software",
        "tool": "software",
        "course-of-action": "mitigation",
        "x-mitre-matrix": "matrix",
        "x-mitre-collection": "collection",
        "relationship": "relationship",
        "note": "note",
        "identity": "identity",
        "marking-definition": "marking-definition",
        "x-mitre-data-source": "data-source",
        "x-mitre-data-component": "data-component"
    }

    constructor(private restAPIService: RestApiConnectorService,
                private dialog: MatDialog,
                private router: Router,
                private sidebarService: SidebarService) {
        // intentionally left blank
    }

    ngOnInit(): void {
        this.loading = true;
        let subscription = this.getUserActivity().subscribe({
            next: (results) => {
                this.parseActivity(results as StixObject[]);
                this.loading = false;
            },
            complete: () => { subscription.unsubscribe(); }
        });
    }

    /**
     * Retrieve recent user activity
     * @returns a list of recent user activity
     */
    public getUserActivity() {
        return forkJoin({
            objects$: this.restAPIService.getAllObjects(null, null, null, null, true, true, true, this.identities),
            relationships$: this.restAPIService.getAllRelationships({ includeRevoked: true, includeDeprecated: true, lastUpdatedBy: this.identities })
        }).pipe(
            map(results => {
                let activity: StixObject[] = [];
                results.objects$.data.forEach((sdo: StixObject) => { if (sdo.attackType !== "relationship") activity.push(sdo) });
                return activity.concat(results.relationships$.data);
            })
        );
    }

    /**
     * Determine if the SDO in the given event is a relationship
     */
    public isRelationship(event): boolean {
        return event.sdo.attackType == 'relationship';
    }

    /**
     * Transform the objects into ActivityEvent objects and add them to the allRecentActivity array
     */
    private parseActivity(activity: StixObject[]): void {
        // build recent activity events
        for (let stixObject of activity) {
            let createEvent = stixObject.created.getTime() == stixObject.modified.getTime();
            let releaseEvent = stixObject.attackType == "collection" && (stixObject as Collection).release;

            let objectName, eventIcon;
            if (createEvent) {
                eventIcon = stixObject.type == "note" ? "sticky_note_2" : "add";
            }
            else eventIcon = "edit";

            if (stixObject.type == "relationship") {
                let relationship = stixObject as Relationship;
                objectName = `${relationship.source_name} ${relationship.relationship_type} ${relationship.target_name}`
            } else if (stixObject.type == "note") {
                objectName = (stixObject as Note).title;
            } else {
                objectName = stixObject["name"] + (stixObject.supportsAttackID && stixObject.attackID ? ` (${stixObject["attackID"]})` : '');
            }

            this.allRecentActivity.push({
                icon: eventIcon,
                name: objectName,
                sdo: stixObject,
                objectCreated: createEvent,
                released: releaseEvent
            });
        }

        // ensure that the stix objects are sorted in ascending order of date
        this.allRecentActivity.sort((a, b) => (b.sdo.modified as any) - (a.sdo.modified as any));
        this.recentActivity = this.allRecentActivity.slice(0, 5);
    }

    /** show more activity */
    public showMore(): void {
        this.recentActivity = this.allRecentActivity.slice(0, this.recentActivity.length + 5);
    }

    /** show less activity */
    public showLess(): void {
        let end = this.recentActivity.length - 5 < 5 ? 5 : this.recentActivity.length - 5;
        this.recentActivity = this.allRecentActivity.slice(0, end);
    }

    /** open the event in a dialog or redirect to the object page */
    public open(event): void {
        if (event.sdo.attackType == 'note') {
            this.sidebarService.opened = true;
            this.sidebarService.currentTab = 'notes';
            let objectRef = (event.sdo as Note).object_refs[0];
            let type = this.typeMap[objectRef.split('--')[0]];
            this.navigateTo(objectRef, type);
        } else {
            this.navigateTo(event.sdo.stixID, event.sdo.attackType);
        }
    }

    /** navigate to the object page */
    public navigateTo(stixID: string, type: string): void {
        let url = `/${type}/${stixID}`;
        if (type == 'collection') {
            // collection URLs must include their modified date
            const collectionSub = this.restAPIService.getCollection(stixID).subscribe({
                next: (result) => {
                    url = `${url}/modified/${result[0].modified.toISOString()}`;
                    this.router.navigateByUrl(url);
                },
                complete: () => { collectionSub.unsubscribe(); }
            });
        } else {
            this.router.navigateByUrl(url);
        }
    }

    /** open dialog preview of object */
    public preview(event): void {
        this.dialog.open(StixDialogComponent, {
            data: {
                object: event.sdo,
                editable: false,
                sidebarControl: "disable"
            },
            maxHeight: "75vh"
        });
    }
}
