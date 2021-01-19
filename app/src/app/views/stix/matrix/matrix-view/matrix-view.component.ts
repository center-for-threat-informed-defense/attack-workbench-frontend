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

  public editing: boolean = false;

  public tactics : Array<StixObject> = [];

  public get matrix(): Matrix { return this.config.object as Matrix; }

  // Get tactics for matrix
  private getTactics(tactics_map) {

    if ("tactic_refs" in this.matrix) {
      for (let tactic_id of this.matrix.tactic_refs) {
        // Add tactic if it is found in the map
        if (tactics_map.get(tactic_id)) this.tactics.push(tactics_map.get(tactic_id))
      }
    }
  }

  constructor(private route: ActivatedRoute, private restAPIConnectorService: RestApiConnectorService) { 
    super();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
        this.editing = params["editing"];
    });

    let subscription = this.restAPIConnectorService.getAllTactics().subscribe({
      next: (all_tactics) => {
        let tactics_map : Map<string, StixObject> = new Map();
        // Create map by stix id
        for (let tactic of all_tactics.data){
          tactics_map.set(tactic.stixID, tactic);
        }

        this.getTactics(tactics_map);
      },
      complete: () => { subscription.unsubscribe(); } //prevent memory leaks
    })

  }

}
