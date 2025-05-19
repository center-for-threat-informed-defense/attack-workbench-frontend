import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss'],
  standalone: false,
})
export class CampaignListComponent implements OnInit {
  public get canEdit(): boolean {
    return this.authenticationService.canEdit();
  }

  constructor(private authenticationService: AuthenticationService) {
    // intentionally left blank
  }

  ngOnInit(): void {
    // intentionally left blank
  }
}
