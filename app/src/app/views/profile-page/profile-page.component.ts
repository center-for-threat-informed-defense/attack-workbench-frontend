import { Component, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfilePageComponent {
    public get user() { return this.authenticationService.currentUser; }

    public get canEdit(): boolean { return this.authenticationService.canEdit(); }

    constructor(private authenticationService: AuthenticationService) {
        // intentionally left blank
    }
}
