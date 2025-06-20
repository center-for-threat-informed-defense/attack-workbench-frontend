import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';

@Component({
  selector: 'app-detection-strategy-list',
  standalone: false,
  templateUrl: './detection-strategy-list.component.html',
  styleUrl: './detection-strategy-list.component.scss',
})
export class DetectionStrategyListComponent {
  public get canEdit(): boolean {
    return this.authenticationService.canEdit();
  }

  constructor(private authenticationService: AuthenticationService) {}
}
