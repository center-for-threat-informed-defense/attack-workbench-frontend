import { Component, Input, OnInit } from '@angular/core';
import { Identity } from 'src/app/classes/stix/identity';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
    selector: 'app-identity-property',
    templateUrl: './identity-property.component.html',
    styleUrls: ['./identity-property.component.scss']
})
export class IdentityPropertyComponent implements OnInit {
    @Input() public config: IdentityPropertyConfig;

    // TODO remove when REST API is complete
    public identity: Identity = new Identity({
        stix: {
            "id": "identity--f3f2-dt2f-324f",
            "type": "identity",
            "name": "MITRE",
            "identity_class": "organization"
        }
    })

    constructor(private restAPIService: RestApiConnectorService) { }

    ngOnInit(): void {
        // TODO uncomment when REST API is complete
        // let object = Array.isArray(this.config.object)? this.config.object[0] : this.config.object;
        // this.identity = object[this.config.field] as Identity;
    }

}

export interface IdentityPropertyConfig {
    /* The object to show the identity field of */
    object: StixObject | [StixObject, StixObject];
    /** field; field of object to be displayed */
    field: string;
}