import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UserAccount } from 'src/app/classes/authn/user-account';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { Role } from '../../../../classes/authn/role';
import { MatPaginator } from '@angular/material/paginator';
import { AuthenticationService } from '../../../../services/connectors/authentication/authentication.service';
import { Team } from 'src/app/classes/authn/team';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewDialogComponent } from 'src/app/components/create-new-dialog/create-new-dialog.component';
import { Router } from '@angular/router';

@Component({
	selector: 'app-teams-list-page',
	templateUrl: './teams-list-page.component.html',
	styleUrls: ['./teams-list-page.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TeamsListPageComponent implements OnInit {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	public teams: Team[];
	public columnsToDisplay: string[];
	public totalObjectCount: number = 0;
	public searchQuery: '';

	public get currentUser(): UserAccount {
		return this.authenticationService.currentUser;
	}

	public get isAdmin(): boolean {
		return this.authenticationService.isAuthorized([Role.ADMIN]);
	}

	constructor(private restAPIConnector: RestApiConnectorService, private authenticationService: AuthenticationService, private dialog: MatDialog, private router: Router) {
		this.columnsToDisplay = ['name', 'description', 'members', 'open_link'];
	}

	ngOnInit(): void {
		this.applyControls();
	}

	/**
	 * Get teams from REST API
	 * @param options 
	 */
	public getTeams(options: { limit: number, offset: number, search?: string }) {
		const subscription = this.restAPIConnector.getAllTeams(options).subscribe({
			next: (response) => {
				this.teams = response.data;
				this.totalObjectCount = response.pagination.total;
			},
			complete: () => subscription.unsubscribe()
		});
	}

	/**
	 * Applies filters in the teams list
	 * @param applyControls whether or not to apply controls as well
	 */
	public applyFilters(applyControls = false): void {
		let limit = this.paginator ? this.paginator.pageSize : 10;
		let offset = this.paginator || applyControls ? this.paginator.pageIndex * limit : 0;
		if (!applyControls && this.paginator) this.paginator.pageIndex = 0;
		this.getTeams({ limit: limit, offset: offset });
	}

	/**
	 * Applies search filter in the teams list
	 * @param applyControls whether or not to apply controls as well
	 */
	public applySearch(query, applyControls = false): void {
		let limit = this.paginator ? this.paginator.pageSize : 10;
		let offset = this.paginator || applyControls ? this.paginator.pageIndex * limit : 0;
		if (!applyControls && this.paginator) this.paginator.pageIndex = 0;
		this.searchQuery = query;
		this.getTeams({ limit: limit, offset: offset, search: query });
	}

	/**
	 * Apply filters in the teams list
	 * @param applyControls whether or not to apply controls as well
	 */
	public applyControls(): void {
		if (this.searchQuery) this.applySearch(this.searchQuery, true);
		if (!this.searchQuery) {
			let limit = this.paginator ? this.paginator.pageSize : 10;
			let offset = this.paginator ? this.paginator.pageIndex * limit : 0;
			this.getTeams({ limit: limit, offset: offset });
		}
	}

	/**
	 * Opens a dialog to allow the user to input a team name and description and create a new team (user will be auto-navigated to the new team page upon completion)
	 */
	public createNewTeam(): void {
		// open create new team dialog
		let prompt = this.dialog.open(CreateNewDialogComponent, {
			maxWidth: "40em",
			minWidth: "40em",
			disableClose: true,
			data: {
				config: {
					objectName: 'team',
					formObjects: [
						{
							name: 'name',
							type: 'text',
							required: true,
						},
						{
							name: 'description',
							type: 'textBox',
							required: false,
						},
					]
				},
			}
		});
		let subscription = prompt.afterClosed().subscribe({
			next: (responseObj) => {
				if (responseObj.createObject) {
					const { name, description } = responseObj.newObject;
					const newTeam = new Team({ name, description, userIDs: [] });
					const createTeamSub = this.restAPIConnector.postTeam(newTeam).subscribe({
						next: (response) => {
							if (response) {
								this.applyControls();
								this.router.navigateByUrl('/admin/teams/' + response.id);
							}
						},
						complete: () => createTeamSub.unsubscribe(),
					});
				}
			},
			complete: () => { subscription.unsubscribe(); } //prevent memory leaks
		});
	}
}
