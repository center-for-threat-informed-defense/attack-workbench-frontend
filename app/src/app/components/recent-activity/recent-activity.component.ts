import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserAccount } from 'src/app/classes/authn/user-account';
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
    @Input() public identity: UserAccount;
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
        this.loadActivity();
    }

    public loadActivity() {
        this.loading = true;

        // set up subscribers to get object versions
        let objects$ = this.restAPIService.getAllObjects(null, null, null, null, true, true, true);
        let subscription = objects$.subscribe({
            next: (results) => {
                this.parseActivity(results.data as StixObject[]);
                this.loading = false;
            },
            complete: () => { subscription.unsubscribe(); }
        });
    }

    public isRelationship(event): boolean {
        return event.sdo.attackType == 'relationship';
    }

    /**
     * Transform the objects into ActivityEvent objects and add them to the allRecentActivity array
     */
    private parseActivity(allObjects: StixObject[]): void {
        let activity = [];
        let objectLookup = {};

        // build object lookup table
        allObjects.forEach(sdo => {
            // check if modified by this identity
            if (sdo.workflow && sdo.workflow.created_by_user_account && sdo.workflow.created_by_user_account == this.identity.id) {
                activity.push(sdo);
            }
            objectLookup[sdo.stixID] = sdo;
        });

        // build recent activity events
        for (let stixObject of activity) {
            let objectCreated = stixObject.created.getTime() == stixObject.modified.getTime();
            let released = stixObject.attackType == "collection" && (stixObject as Collection).release;

            let objectName;
            if (stixObject.type == "relationship") {
                let relationship = stixObject as Relationship;
                relationship.set_source_object(objectLookup[relationship.source_ref], this.restAPIService);
                relationship.set_target_object(objectLookup[relationship.target_ref], this.restAPIService);
                objectName = `${relationship.source_name} ${relationship.relationship_type} ${relationship.target_name}`
            } else if (stixObject.type == "note") {
                objectName = (stixObject as Note).title;
            } else {
                objectName = stixObject["name"] + (stixObject.supportsAttackID && stixObject.attackID ? ` (${stixObject["attackID"]})` : '');
            }

            this.allRecentActivity.push({
                icon: objectCreated ? (stixObject.type == "note" ? "sticky_note_2" : "add") : "edit",
                name: objectName,
                sdo: stixObject,
                object_ref: stixObject.type == "note" ? objectLookup[(stixObject as Note).object_refs[0]] : undefined,
                objectCreated: objectCreated,
                released: released
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
