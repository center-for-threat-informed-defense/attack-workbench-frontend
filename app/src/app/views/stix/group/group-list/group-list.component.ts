import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {
    public get canEdit(): boolean { return this.authenticationService.canEdit; }
    
    constructor(private authenticationService: AuthenticationService) { }

    ngOnInit() {}

}
