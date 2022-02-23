import { Component, OnInit } from '@angular/core';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { StixViewPage } from '../../stix-view-page';
import { Relationship } from 'src/app/classes/stix/relationship';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";

@Component({
    selector: 'app-mitigation-view',
    templateUrl: './mitigation-view.component.html',
    styleUrls: ['./mitigation-view.component.scss']
})
export class MitigationViewComponent extends StixViewPage implements OnInit {
    public get mitigation(): Mitigation { return this.config.object as Mitigation; }

    public relationships: Relationship[] = [];

    constructor(authenticationService: AuthenticationService, private restApiConnector: RestApiConnectorService) {
        super(authenticationService);
    }

    ngOnInit() {
        if (this.mitigation.firstInitialized ) {
            this.mitigation.initializeWithDefaultMarkingDefinitions(this.restApiConnector);
        }
    }
}
