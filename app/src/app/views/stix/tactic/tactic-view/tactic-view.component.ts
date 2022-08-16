import { Component, OnInit } from '@angular/core';
import { Tactic } from 'src/app/classes/stix/tactic';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { StixViewPage } from '../../stix-view-page';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
    selector: 'app-tactic-view',
    templateUrl: './tactic-view.component.html',
    styleUrls: ['./tactic-view.component.scss']
})
export class TacticViewComponent extends StixViewPage implements OnInit {
    public get tactic(): Tactic { return this.config.object as Tactic; }
    // public techniques: StixObject[];
    public get techniques(): StixObject[] { return []; }

    constructor(authenticationService: AuthenticationService, private restApiConnector: RestApiConnectorService) {
        super(authenticationService);
    }

    ngOnInit() {
        if (this.tactic.firstInitialized) {
            this.tactic.initializeWithDefaultMarkingDefinitions(this.restApiConnector);
        }
        this.getTechniques();
    }

    public getTechniques(): void {
        // let data$: any = this.restApiConnector.getTechniquesInTactic(this.tactic.stixID);
        // let subscription = data$.subscribe({
        //     next: (data) => { this.techniques = data.data; },
        //     complete: () => { subscription.unsubscribe() }
        // })
    }
}
