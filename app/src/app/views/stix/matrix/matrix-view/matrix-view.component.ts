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

    public view: String = "flat";
    public get matrix(): Matrix { return this.config.object as Matrix; }

    public tacticList = [];
    public matrixMap: Map<string, Technique[]>;

    constructor(private restAPIConnectorService: RestApiConnectorService, authenticationService: AuthenticationService) {
        super(authenticationService);
    }

    ngOnInit() {
      this.matrixMap = new Map<string, Technique[]>();

        if (!this.config.hasOwnProperty('showRelationships') || this.config.showRelationships) {
            let subscription = this.restAPIConnectorService.getAllTactics().subscribe({
                next: (all_tactics) => {
                  this.all_tactics = all_tactics.data;
                  // sort tactics according to the order of attack website
                  this.matrix.tactic_refs.forEach(item => {
                    this.tacticList.push(all_tactics.data.find(e => e.stixID === item))
                  });
                  this.tacticList.forEach((tactic) => {
                    let itemsCopy;
                    let subscription = this.restAPIConnectorService.getTechniquesInTactic(tactic.stixID, tactic.modified).subscribe({
                      next: (items) => {
                        // alphabetically order subtechniques
                        itemsCopy = items.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                        this.matrixMap.set(tactic.stixID, itemsCopy)
                      },
                      complete: () => {
                        subscription.unsubscribe();
                      }
                    })
                  })
                },
                complete: () => { subscription.unsubscribe(); } //prevent memory leaks
            })
        }
        if (this.matrix.firstInitialized) {
            this.matrix.initializeWithDefaultMarkingDefinitions(this.restAPIConnectorService);
        }

    }
    public toggleAllSubtechniquesVisible(value: boolean) {
      for (let entry of this.matrixMap.entries()) {
        for (let technique of entry[1])
        {
          technique.show_subtechniques = value
        }
      }
    }
}
