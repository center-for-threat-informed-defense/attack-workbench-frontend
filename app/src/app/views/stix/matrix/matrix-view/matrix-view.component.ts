import { Component, OnInit } from '@angular/core';
import { Matrix } from 'src/app/classes/stix/matrix';
import { StixViewPage } from '../../stix-view-page';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { Tactic } from 'src/app/classes/stix/tactic';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
    selector: 'app-matrix-view',
    templateUrl: './matrix-view.component.html',
    styleUrls: ['./matrix-view.component.scss']
})
export class MatrixViewComponent extends StixViewPage implements OnInit {
    public all_tactics: Array<StixObject> = [];
    public matrix_tactics: Array<Tactic> = [];
    public view: string = "side";
    public get matrix(): Matrix { return this.config.object as Matrix; }
    public loaded = false;

    constructor(private restAPIConnectorService: RestApiConnectorService, authenticationService: AuthenticationService) {
        super(authenticationService);
    }

    ngOnInit() {

        if (!this.config.hasOwnProperty('showRelationships') || this.config.showRelationships) {
          // all tactics used for adding any possible tactic to matrix
          let allTacticSubscription = this.restAPIConnectorService.getAllTactics().subscribe({
            next: (all_tactics) => {
                this.all_tactics = all_tactics.data;
            },
            complete: () => { allTacticSubscription.unsubscribe();} //prevent memory leaks
          });
          // matrix tactics used for displaying matrix in side or flat view
          let matrixSubscription = this.restAPIConnectorService.getTechniquesInMatrix(this.matrix).subscribe({
              next: () => { this.loaded = true
              this.matrix_tactics = this.matrix.tactic_objects
            },
              complete: () => { matrixSubscription.unsubscribe(); } //prevent memory leaks
          })
        }
        if (this.matrix.firstInitialized) {
            this.matrix.initializeWithDefaultMarkingDefinitions(this.restAPIConnectorService);
        }

    }
    /***
     * Hide or show all subtechniques in matrix
     * @param {boolean} value whether or not subtechniques should be visible
     */
    public toggleAllSubtechniquesVisible(value: boolean) {
      for (let tactic of this.matrix_tactics) {
        for (let technique of tactic.technique_objects)
        {
          technique.show_subtechniques = value
        }
      }
    }
}
