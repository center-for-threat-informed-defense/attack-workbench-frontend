import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';

@Component({
  selector: 'app-technique-list',
  templateUrl: './technique-list.component.html',
})
export class TechniqueListComponent implements OnInit {
  public get canEdit(): boolean {
    return this.authenticationService.canEdit();
  }

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
    // intentionally left blank
  }
}
