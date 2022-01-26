import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/classes/stix/group';
import { StixViewPage } from '../../stix-view-page';
import { Relationship } from 'src/app/classes/stix/relationship';
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.scss']
})
export class GroupViewComponent extends StixViewPage implements OnInit {
  
    public get group(): Group {
        let group = this.config.object as Group;
        if ( group.firstInitialized == true ) {
            group.initializeWithDefaultMarkingDefinitions(this.restApiConnector);
        }
        return this.config.object as Group; 
    }

    public relationships_techniques: Relationship[] = []

    public relationships_software: Relationship[] = []

    constructor(private restApiConnector: RestApiConnectorService, private route: ActivatedRoute) { 
        super()
    }

    ngOnInit() {}

}
