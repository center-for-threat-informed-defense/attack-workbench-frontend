import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';

@Component({
    selector: 'app-mitigation-list',
    templateUrl: './mitigation-list.component.html',
    styleUrls: ['./mitigation-list.component.scss']
})
export class MitigationListComponent implements OnInit {
    public get canEdit(): boolean { return this.authenticationService.canEdit(); }

    constructor(private authenticationService: AuthenticationService) { }

    ngOnInit() { }
}
