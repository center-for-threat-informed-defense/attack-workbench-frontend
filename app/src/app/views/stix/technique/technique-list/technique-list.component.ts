import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';

@Component({
    selector: 'app-technique-list',
    templateUrl: './technique-list.component.html',
    styleUrls: ['./technique-list.component.scss']
})
export class TechniqueListComponent implements OnInit {
    public get canEdit(): boolean { return this.authenticationService.canEdit; }

    constructor(private authenticationService: AuthenticationService) { }

    ngOnInit() { }
}
