import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';

@Component({
    selector: 'app-data-source-list',
    templateUrl: './data-source-list.component.html'
})
export class DataSourceListComponent {
    public get canEdit(): boolean { return this.authenticationService.canEdit; }
    
    constructor(private authenticationService: AuthenticationService) { }
}
