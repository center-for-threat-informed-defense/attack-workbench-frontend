import { Component, ViewEncapsulation } from '@angular/core';
import { UserAccount } from 'src/app/classes/authn/user-account';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { EditorService } from 'src/app/services/editor/editor.service';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfilePageComponent {
    public get user(): UserAccount { return this.authenticationService.currentUser; }
    public get editing(): boolean { return this.editorService.editing; }
    public get canEdit(): boolean { return this.authenticationService.canEdit(); }

    constructor(private authenticationService: AuthenticationService,
                private editorService: EditorService) {
        // intentionally left blank
    }
}
