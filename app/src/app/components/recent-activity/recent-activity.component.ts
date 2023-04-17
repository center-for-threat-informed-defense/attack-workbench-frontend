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

    public getUserActivity() {
        return forkJoin({
            objects$: this.restAPIService.getAllObjects(null, null, null, null, true, true, true, this.identities),
            relationships$: this.restAPIService.getAllRelationships({includeRevoked: true, includeDeprecated: true, lastUpdatedBy: this.identities})
        }).pipe(
            map(results => {
                let activity : StixObject[] = [];
                results.objects$.data.forEach((sdo: StixObject) => {if (sdo.attackType !== "relationship") activity.push(sdo)});
                return activity.concat(results.relationships$.data);
            })
        );
    }

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

            let objectName;
            if (stixObject.type == "relationship") {
                let relationship = stixObject as Relationship;
                objectName = `${relationship.source_name} ${relationship.relationship_type} ${relationship.target_name}`
            } else if (stixObject.type == "note") {
                objectName = (stixObject as Note).title;
            } else {
                objectName = stixObject["name"] + (stixObject.supportsAttackID && stixObject.attackID ? ` (${stixObject["attackID"]})` : '');
            }

            this.allRecentActivity.push({
                icon: createEvent ? (stixObject.type == "note" ? "sticky_note_2" : "add") : "edit",
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

    /** redirect to object page */
    public open(event): void {
        if (event.sdo.attackType == 'note') {
            this.sidebarService.opened = true;
            this.sidebarService.currentTab = 'notes';
            this.router.navigateByUrl('/' + event.object_ref.attackType + '/' + event.object_ref.stixID);
        } else {
            this.router.navigateByUrl('/' + event.sdo.attackType + '/' + event.sdo.stixID);
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
