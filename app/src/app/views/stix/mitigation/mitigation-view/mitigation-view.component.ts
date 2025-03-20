import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { StixViewPage } from '../../stix-view-page';
import { Relationship } from 'src/app/classes/stix/relationship';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
    selector: 'app-mitigation-view',
    templateUrl: './mitigation-view.component.html',
    styleUrls: ['./mitigation-view.component.scss']
})
export class MitigationViewComponent extends StixViewPage implements OnInit {
    @Output() public onReload = new EventEmitter();
    public get mitigation(): Mitigation { return this.configCurrentObject as Mitigation; }
    public get previous(): Mitigation { return this.configPreviousObject as Mitigation; }

    public get showSecurityControls(): boolean {
        if (!this.config.mode || this.config.mode == 'view') return this.mitigation.securityControls.length > 0;
        if (this.config.mode == 'edit') return this.editing && this.mitigation.domains.includes('ics-attack');
        if (this.config.mode == 'diff') return this.mitigation?.securityControls?.length > 0 || this.previous?.securityControls?.length > 0;
        return false;
    }

    constructor(authenticationService: AuthenticationService, private restApiConnector: RestApiConnectorService) {
        super(authenticationService);
    }

    ngOnInit() {
        if (this.mitigation.firstInitialized ) {
            this.mitigation.initializeWithDefaultMarkingDefinitions(this.restApiConnector);
        }
    }
}
