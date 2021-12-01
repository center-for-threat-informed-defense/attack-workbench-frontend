import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Identity } from 'src/app/classes/stix/identity';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { AuthenticationService } from '../../../services/connectors/authentication/authentication.service';

@Component({
    selector: 'app-identity-property',
    templateUrl: './identity-property.component.html',
    styleUrls: ['./identity-property.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class IdentityPropertyComponent implements OnInit {
    @Input() public config: IdentityPropertyConfig;

    public identity: Identity;

    constructor(private authenticationService: AuthenticationService) { }

    ngOnInit(): void {
        const object = Array.isArray(this.config.object) ? this.config.object[0] : this.config.object;
        if (object[this.config.field]) {
          this.identity = object[this.config.field] as Identity;
        }
        if (this.authenticationService.isLoggedIn && this.config.object && 'workflow' in this.config.object && this.config.object.workflow && 'created_by_user_account' in this.config.object.workflow) {
          this.identity.name = this.config.object.workflow.created_by_user_account;
        }
    }
}

export interface IdentityPropertyConfig {
    /* The object to show the identity field of */
    object: StixObject | [StixObject, StixObject];
    /* Field of object to be displayed */
    field: string;
    /* Show identity name? If true, display the identity name next to its icon. Defaults to False */
    displayName?: boolean;
    /* Field of the timestamp to be displayed. Defaults to none */
    timeField?: string;
}
