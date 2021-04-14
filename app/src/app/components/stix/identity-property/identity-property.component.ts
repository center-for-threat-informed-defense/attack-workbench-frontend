import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Identity } from 'src/app/classes/stix/identity';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
    selector: 'app-identity-property',
    templateUrl: './identity-property.component.html',
    styleUrls: ['./identity-property.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class IdentityPropertyComponent implements OnInit {
    @Input() public config: IdentityPropertyConfig;

    public identity: Identity;

    constructor() { }

    ngOnInit(): void {
        let object = Array.isArray(this.config.object)? this.config.object[0] : this.config.object;
        if (object[this.config.field]) this.identity = object[this.config.field] as Identity;
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