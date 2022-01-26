import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Software } from 'src/app/classes/stix/software';
import { StixViewPage } from '../../stix-view-page';
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";

@Component({
  selector: 'app-software-view',
  templateUrl: './software-view.component.html',
  styleUrls: ['./software-view.component.scss']
})
export class SoftwareViewComponent extends StixViewPage implements OnInit {
    // public editing: boolean = false;

    public get software(): Software { 
        let software = this.config.object as Software;
        if ( software.firstInitialized ) {
          software.initializeWithDefaultMarkingDefinitions(this.restApiConnector)
        }
        return this.config.object as Software; 
    }
    
    constructor(private restApiConnector: RestApiConnectorService, private route: ActivatedRoute) { super() }

    ngOnInit() {
        // this.route.queryParams.subscribe(params => {
        //     this.editing = params["editing"];
        // });
    }

}
