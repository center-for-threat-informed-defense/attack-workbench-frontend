import { Component, OnInit } from '@angular/core';
import { Group } from 'src/app/classes/stix/group';
import { StixViewPage } from '../../stix-view-page';
import { Relationship } from 'src/app/classes/stix/relationship';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";

@Component({
    selector: 'app-group-view',
    templateUrl: './group-view.component.html',
    styleUrls: ['./group-view.component.scss']
})
export class GroupViewComponent extends StixViewPage implements OnInit {
    public get group(): Group { return this.config.object as Group; }
    public relationships_techniques: Relationship[] = [];
    public relationships_software: Relationship[] = [];

    constructor(authenticationService: AuthenticationService, private restApiConnector: RestApiConnectorService) {
        super(authenticationService);
    }

    ngOnInit() {
      if (this.group.firstInitialized) {
        this.group.initializeWithDefaultMarkingDefinitions(this.restApiConnector);
      }
      if (this.group.supportsNamespace && this.editing) {
        this.group.generateAttackIDWithPrefix(this.restApiConnector);
      }
    }
}
