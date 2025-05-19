import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss'],
  standalone: false,
})
export class AssetListComponent {
  public get canEdit(): boolean {
    return this.authenticationService.canEdit();
  }

  constructor(private authenticationService: AuthenticationService) {
    // intentionally left blank
  }
}
