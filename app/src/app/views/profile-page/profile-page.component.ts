import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAccount } from 'src/app/classes/authn/user-account';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { EditorService } from 'src/app/services/editor/editor.service';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfilePageComponent implements OnInit, OnDestroy {
    private saveSubscription: Subscription;

    public get user(): UserAccount { return this.authenticationService.currentUser; }
    public get editing(): boolean { return this.editorService.editing; }
    public get canEdit(): boolean { return this.authenticationService.canEdit(); }

    constructor(private authenticationService: AuthenticationService,
                private editorService: EditorService,
                private restApiService: RestApiConnectorService,
                private router: Router) {
        // intentionally left blank
    }

    ngOnInit(): void {
        this.saveSubscription = this.editorService.onSave.subscribe({
            next: (_event) => this.save()
        });
    }

    ngOnDestroy() {
        this.saveSubscription.unsubscribe();
    }

    /** save profile changes */
    private save(): void {
        let saveUser = this.user.save(this.restApiService).subscribe({
            next: (_saveResult) => this.router.navigate(["/profile"]),
            complete: () => { saveUser.unsubscribe(); }
        })
    }
}
