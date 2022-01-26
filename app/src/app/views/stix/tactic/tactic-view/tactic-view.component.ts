import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tactic } from 'src/app/classes/stix/tactic';
import { StixViewPage } from '../../stix-view-page';
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";

@Component({
  selector: 'app-tactic-view',
  templateUrl: './tactic-view.component.html',
  styleUrls: ['./tactic-view.component.scss']
})
export class TacticViewComponent extends StixViewPage implements OnInit {
  
  public get tactic(): Tactic { 
      let tactic = this.config.object as Tactic;
      if ( tactic.firstInitialized ) {
        tactic.initializeWithDefaultMarkingDefinitions(this.restApiConnector)
      }
      return this.config.object as Tactic; 
  }

  constructor(private restApiConnector: RestApiConnectorService, private route: ActivatedRoute) { 
    super()
  }

  ngOnInit() {
    // this.route.queryParams.subscribe(params => {
    //   this.editing = params["editing"];
    // });
  }

}
