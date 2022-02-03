import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { StixViewPage } from '../../stix-view-page';
import { Relationship } from 'src/app/classes/stix/relationship';
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";

@Component({
  selector: 'app-mitigation-view',
  templateUrl: './mitigation-view.component.html',
  styleUrls: ['./mitigation-view.component.scss']
})
export class MitigationViewComponent extends StixViewPage implements OnInit {
  
    // public editing: boolean = false;

    public get mitigation(): Mitigation { 
        return this.config.object as Mitigation; 
    }

    public relationships: Relationship[] = []

    constructor(private restApiConnector: RestApiConnectorService, private route: ActivatedRoute) { 
        super()
    }

    ngOnInit() {
        // this.route.queryParams.subscribe(params => {
        //     this.editing = params["editing"];
        // });
        let mitigation = this.config.object as Mitigation;
        if ( mitigation.firstInitialized ) {
            mitigation.initializeWithDefaultMarkingDefinitions(this.restApiConnector);
        }
    }

}
