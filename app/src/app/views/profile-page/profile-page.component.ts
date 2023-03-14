import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfilePageComponent implements OnInit {
    public get user() { return this.authenticationService.currentUser; }
    public recentActivity: StixObject[];
    public reload: boolean = false;
    public data$;

    public get canEdit(): boolean { return this.authenticationService.canEdit(); }

    constructor(private authenticationService: AuthenticationService, private restApiService: RestApiConnectorService) {
        // intentionally left blank
    }

    ngOnInit(): void {
        this.loadRecentActivity();
    }

    public loadRecentActivity() {
        this.data$ = this.restApiService.getAllObjects(null, null, null, null, true, true, true);
        let subscription = this.data$.subscribe({
            next: (results) => {
                let stixObjects = results.data as StixObject[];
                this.recentActivity = stixObjects.filter(sdo => {
                    if (sdo.type == 'relationship') return false; // # TODO unfilter relationships
                    if (sdo.workflow && sdo.workflow.created_by_user_account) {
                        return sdo.workflow.created_by_user_account == this.user.id;
                    }
                    return false;
                });
                this.reload = true;
                window.setTimeout(() => this.reload = false)
            },
            complete: () => { subscription.unsubscribe(); }
        })
    }
}
