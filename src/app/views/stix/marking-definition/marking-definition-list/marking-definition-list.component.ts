import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/classes/authn/role';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';

@Component({
  selector: 'app-marking-definition-list',
  templateUrl: './marking-definition-list.component.html',
  standalone: false,
})
export class MarkingDefinitionListComponent implements OnInit {
  public get isAdmin(): boolean {
    return this.authenticationService.isAuthorized([Role.ADMIN]);
  }

  constructor(private authenticationService: AuthenticationService) {
    // empty constructor
  }

  ngOnInit() {
    // empty on init
  }
}
