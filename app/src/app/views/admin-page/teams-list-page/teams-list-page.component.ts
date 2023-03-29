import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserAccount } from 'src/app/classes/authn/user-account';
import { Paginated, RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { Role } from '../../../classes/authn/role';
import { MatPaginator } from '@angular/material/paginator';
import { AuthenticationService } from '../../../services/connectors/authentication/authentication.service';
import { Team } from 'src/app/classes/authn/team';

@Component({
  selector: 'app-teams-list-page',
  templateUrl: './teams-list-page.component.html',
  styleUrls: ['./teams-list-page.component.scss']
})
export class TeamsListPageComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public teams: Team[];
  public columnsToDisplay: string[];
  public totalObjectCount: number = 0;
  public userSubscription: Subscription;
  public searchQuery: '';

  public get currentUser(): UserAccount {
      return this.authenticationService.currentUser;
  }

  public get isAdmin(): boolean {
      return this.authenticationService.isAuthorized([Role.ADMIN]);
  }

  constructor(private restAPIConnector: RestApiConnectorService, private authenticationService: AuthenticationService) {
      this.columnsToDisplay = ['name', 'description', 'members', 'options'];
  }

  ngOnInit(): void {
      this.getTeams({limit: 10, offset: 0});
  }

  public getTeams(options: { limit: number, offset: number, search?: string }) {
    const hold = this.restAPIConnector.getAllTeams(options);
    this.teams = hold.data;
    this.totalObjectCount = hold.pagination.total;
  }

  public applyFilters(applyControls = false): void {
      let limit = this.paginator ? this.paginator.pageSize : 10;
      let offset = this.paginator || applyControls ? this.paginator.pageIndex * limit : 0;
      if (!applyControls && this.paginator) this.paginator.pageIndex = 0;
      this.getTeams({limit: limit, offset: offset});
  }

  public applySearch(query, applyControls = false): void {
      let limit = this.paginator ? this.paginator.pageSize : 10;
      let offset = this.paginator || applyControls ? this.paginator.pageIndex * limit : 0;
      if (!applyControls && this.paginator) this.paginator.pageIndex = 0;
      this.searchQuery = query;
      this.getTeams({limit: limit, offset: offset, search: query});
  }

  public applyControls(): void {
      if (this.searchQuery) this.applySearch(this.searchQuery, true);
      if (!this.searchQuery) {
          let limit = this.paginator ? this.paginator.pageSize : 10;
          let offset = this.paginator ? this.paginator.pageIndex * limit : 0;
          this.getTeams({limit: limit, offset: offset});
      }
  }
}
