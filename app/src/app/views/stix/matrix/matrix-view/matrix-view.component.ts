import { Component, OnInit } from '@angular/core';
import { Matrix } from 'src/app/classes/stix/matrix';
import { StixViewPage } from '../../stix-view-page';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';

@Component({
    selector: 'app-matrix-view',
    templateUrl: './matrix-view.component.html',
    styleUrls: ['./matrix-view.component.scss']
})
export class MatrixViewComponent extends StixViewPage implements OnInit {
    public all_tactics: Array<StixObject>;

    public view: String = "side";
    public get matrix(): Matrix { return this.config.object as Matrix; }
    public thisMatrix : Matrix;

    constructor(private restAPIConnectorService: RestApiConnectorService, authenticationService: AuthenticationService) {
        super(authenticationService);
    }

    ngOnInit() {

        if (!this.config.hasOwnProperty('showRelationships') || this.config.showRelationships) {
            let subscription = this.restAPIConnectorService.getTechniquesInMatrix(this.matrix).subscribe({
                next: (data) => {
                  this.thisMatrix = data;
                },
                complete: () => { subscription.unsubscribe(); } //prevent memory leaks
            })
        }
        if (this.matrix.firstInitialized) {
            this.matrix.initializeWithDefaultMarkingDefinitions(this.restAPIConnectorService);
        }

    }
    public toggleAllSubtechniquesVisible(value: boolean) {
      for (let tactic of this.matrix.tactic_objects) {
        for (let technique of tactic.technique_objects)
        {
          technique.show_subtechniques = value
        }
      }
    }
}
