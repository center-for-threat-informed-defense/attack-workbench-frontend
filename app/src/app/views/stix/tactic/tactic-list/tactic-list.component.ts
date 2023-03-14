import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';

@Component({
    selector: 'app-tactic-list',
    templateUrl: './tactic-list.component.html',
    styleUrls: ['./tactic-list.component.scss']
})
export class TacticListComponent implements OnInit {
    public get canEdit(): boolean { return this.authenticationService.canEdit(); }

    constructor(private authenticationService: AuthenticationService) { }

    ngOnInit() {
        // intentionally left blank
    }
}
