import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';

@Component({
  selector: 'app-log-source-list',
  standalone: false,
  templateUrl: './log-source-list.component.html',
  styleUrl: './log-source-list.component.scss',
})
export class LogSourceListComponent {
  public get canEdit(): boolean {
    return this.authenticationService.canEdit();
  }

  constructor(private authenticationService: AuthenticationService) {}
}
