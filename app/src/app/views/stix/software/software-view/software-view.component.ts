import { Component, OnInit } from '@angular/core';
import { Software } from 'src/app/classes/stix/software';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { StixViewPage } from '../../stix-view-page';

@Component({
    selector: 'app-software-view',
    templateUrl: './software-view.component.html',
    styleUrls: ['./software-view.component.scss']
})
export class SoftwareViewComponent extends StixViewPage implements OnInit {
    public get software(): Software { return this.config.object as Software; }

    constructor(authenticationService: AuthenticationService) {
        super(authenticationService);
    }

    ngOnInit() {
        // intentionally left blank
    }

}
