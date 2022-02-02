import { Component, OnInit } from '@angular/core';
import { Matrix } from 'src/app/classes/stix/matrix';
import { StixViewPage } from '../../stix-view-page';
import { ActivatedRoute } from '@angular/router';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { Observable } from 'rxjs';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-matrix-view',
  templateUrl: './matrix-view.component.html',
  styleUrls: ['./matrix-view.component.scss']
})
export class MatrixViewComponent extends StixViewPage implements OnInit {

//   public editing: boolean = false;

  public all_tactics : Array<StixObject>;

  public get matrix(): Matrix { 
    let matrix = this.config.object as Matrix;
    if ( matrix.firstInitialized ) {
      matrix.initializeWithDefaultMarkingDefinitions(this.restAPIConnectorService)
    }
    return this.config.object as Matrix; 
  }

  constructor(private route: ActivatedRoute, private restAPIConnectorService: RestApiConnectorService) { 
    super();
  }

  ngOnInit() {
    // this.route.queryParams.subscribe(params => {
    //     this.editing = params["editing"];
    // });
    if (!this.config.hasOwnProperty('showRelationships') || this.config.showRelationships) {
        let subscription = this.restAPIConnectorService.getAllTactics().subscribe({
          next: (all_tactics) => {
            this.all_tactics = all_tactics.data;
          },
          complete: () => { subscription.unsubscribe(); } //prevent memory leaks
        })
    }
  }

}
