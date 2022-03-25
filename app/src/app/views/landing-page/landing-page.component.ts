import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Role } from 'src/app/classes/authn/role';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { stixRoutes } from "../../app-routing-stix.module";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LandingPageComponent implements OnInit, OnDestroy {
    private loginSubscription: Subscription;
    public pendingUsers;
    public routes: any[] = [];

    constructor(private restApiConnector: RestApiConnectorService, private authenticationService: AuthenticationService, private dialog: MatDialog, private router: Router) {
        this.routes = stixRoutes;
    }

    public get isAdmin(): boolean { return this.authenticationService.isAuthorized([Role.ADMIN]); }
    public get isLoggedIn(): boolean { return this.authenticationService.isLoggedIn; }

    ngOnInit() {
        this.loginSubscription = this.authenticationService.onLogin.subscribe({ // called on initial user login
            next: (event) => {
                this.getPendingUsers();
                this.openOrgIdentityDialog();
            }
        });
        setTimeout(() => { this.getPendingUsers(); this.openOrgIdentityDialog(); }, 500); // called on page refresh or re-route
    }

    private getPendingUsers(): void {
        if (this.authenticationService.isAuthorized([Role.ADMIN])) {
            console.log("?????")
            let userSubscription = this.restApiConnector.getAllUserAccounts({status: ["pending"]}).subscribe({
                next: (results) => {
                    let users = results as any;
                    if (users && users.length) this.pendingUsers = users.length;
                },
                complete: () => userSubscription.unsubscribe()
            });
        }
    }

    // bug the admin about editing their organization identity
    private openOrgIdentityDialog(): void {
        if (this.authenticationService.isAuthorized([Role.ADMIN])) {
            let subscription = this.restApiConnector.getOrganizationIdentity().subscribe({
                next: (identity) => {
                    if (identity && identity.name == "Placeholder Organization Identity") {
                        let prompt = this.dialog.open(ConfirmationDialogComponent, {
                            maxWidth: "35em",
                            data: {
                                message: '### Your organization identity has not yet been set.\n\nYour organization identity is used for attribution of edits you make to objects in the knowledge base and is attached to published collections. Currently, a placeholder is being used.\n\nUpdate your organization identity now?',
                                yes_suffix: "edit my identity now",
                                no_suffix: "edit my identity later"
                            }
                        })
                        let prompt_subscription = prompt.afterClosed().subscribe({
                            next: (prompt_result) => {
                                if (prompt_result) this.router.navigate(["/admin/org-identity"]);
                            },
                            complete: () => { prompt_subscription.unsubscribe(); }
                        })
                    }
                },
                complete: () => subscription.unsubscribe()
            })
        }
    }

    ngOnDestroy() {
        this.loginSubscription.unsubscribe();
    }
}
