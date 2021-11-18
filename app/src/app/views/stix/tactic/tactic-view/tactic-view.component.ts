import { Component, OnInit } from '@angular/core';
import { Tactic } from 'src/app/classes/stix/tactic';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { StixViewPage } from '../../stix-view-page';

@Component({
    selector: 'app-tactic-view',
    templateUrl: './tactic-view.component.html',
    styleUrls: ['./tactic-view.component.scss']
})
export class TacticViewComponent extends StixViewPage implements OnInit {
    public get tactic(): Tactic { return this.config.object as Tactic; }

    constructor(authenticationService: AuthenticationService) {
        super(authenticationService);
    }

    ngOnInit() { }

}
