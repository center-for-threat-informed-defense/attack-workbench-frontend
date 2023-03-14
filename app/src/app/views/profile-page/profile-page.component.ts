import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfilePageComponent implements OnInit {
    public get user() { return this.authenticationService.currentUser; }

    constructor(private authenticationService: AuthenticationService) {
        // intentionally left blank
    }

    ngOnInit(): void {
        // intentionally left blank
    }
}
