import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';

@Component({
  selector: 'app-analytic-list',
  standalone: false,
  templateUrl: './analytic-list.component.html',
  styleUrl: './analytic-list.component.scss',
})
export class AnalyticListComponent {
  public get canEdit(): boolean {
    return this.authenticationService.canEdit();
  }

  constructor(private authenticationService: AuthenticationService) {}
}
