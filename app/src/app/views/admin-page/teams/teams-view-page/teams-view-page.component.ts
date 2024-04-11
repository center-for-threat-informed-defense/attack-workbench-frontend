import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { EditorService } from 'src/app/services/editor/editor.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { AddDialogComponent } from 'src/app/components/add-dialog/add-dialog.component';
import { Team } from 'src/app/classes/authn/team';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { DeleteDialogComponent } from 'src/app/components/delete-dialog/delete-dialog.component';

@Component({
	selector: 'app-teams-view-page',
	templateUrl: './teams-view-page.component.html',
	styleUrls: ['./teams-view-page.component.scss']
})
export class TeamsViewPageComponent implements OnInit, OnDestroy {
	public editing: boolean;
	public team: Team = null;
	private subscriptions: Array<Subscription> = [];
	private teamId = '';

	constructor(private restAPIConnector: RestApiConnectorService, private route: ActivatedRoute, private editorService: EditorService, private router: Router, private dialog: MatDialog, private snackbar: MatSnackBar,) {
		// intentionally left blank
	}

	ngOnInit(): void {
		// Basically recreating the STIX object code but dumbing it down
		this.subscriptions.push(this.route.params.subscribe((params) => {
			this.teamId = params.id;
		}));
		this.subscriptions.push(this.route.queryParams.subscribe((queryParams) => {
			this.editing = queryParams.editing ? queryParams.editing : false;
		}));
		this.subscriptions.push(this.editorService.onSave.subscribe(() => {
			const validateTeamSub = this.team.validate(this.restAPIConnector).subscribe({
				next: (result) => {
					if (result.errors.length != 0) {
						this.snackbar.open(result.errors[0].message, null, { duration: 2000, panelClass: 'warn' });
					} else {
						const putRequest = this.restAPIConnector.putTeam(this.team).subscribe({
							next: () => { this.router.navigate([]); },
							complete: () => { putRequest.unsubscribe(); }
						});
					}
				},
				complete: () => { validateTeamSub.unsubscribe(); }
			});
		}));
		this.subscriptions.push(this.editorService.onDelete.subscribe(() => {
			this.delete();
		}));
		this.subscriptions.push(this.editorService.onEditingStopped.subscribe(() => {
			this.loadTeam();
		}));
		this.loadTeam();
	}

	ngOnDestroy(): void {
		for (let i = 0; i < this.subscriptions.length; i++) {
			this.subscriptions[i].unsubscribe();
		}
	}

	/**
	 * Deletes the currently loaded team object after the users confirms through a dialog box
	 */
	private delete(): void {
		const prompt = this.dialog.open(DeleteDialogComponent, {
			maxWidth: "35em",
			disableClose: true,
			autoFocus: false
		});
		const closeSubscription = prompt.afterClosed().subscribe({
			next: (confirm) => {
				if (confirm) {
					const deleteRequest = this.restAPIConnector.deleteTeam(this.team).subscribe({
						next: () => { this.router.navigate(['..'], { relativeTo: this.route }); },
						complete: () => { deleteRequest.unsubscribe(); }
					});
				}
			},
			complete: () => closeSubscription.unsubscribe()
		})
	}

	/**
	 * Loads the selected team from the REST API
	 */
	public loadTeam(): void {
		this.team = null;
		const subscription = this.restAPIConnector.getTeam(this.teamId).subscribe({
			next: (team) => { this.team = new Team(team) },
			complete: () => { subscription.unsubscribe(); }
		});
	}

	/**
	 * Opens up the add users dialog component to allow users to select which users they wish to be part of the team
	 */
	public updateUsers(): void {
		const select = new SelectionModel<string>(true);
		for (let i = 0; i < this.team.userIDs.length; i++) {
			select.toggle(this.team.userIDs[i]);
		}
		let prompt = this.dialog.open(AddDialogComponent, {
			maxWidth: "40em",
			minWidth: "40em",
			disableClose: true,
			autoFocus: false, // disables auto focus on the dialog form field
			data: {
				select,
				type: 'user',
				title: `Select users you wish to be in this team`,
				buttonLabel: "CONFIRM",
				clearSelection: false,
			},
		});
		let subscription = prompt.afterClosed().subscribe({
			next: (response) => {
				if (response) {
					this.team.userIDs = select.selected;
					const putRequest = this.restAPIConnector.putTeam(this.team).subscribe({
						next: () => { this.loadTeam(); },
						complete: () => { putRequest.unsubscribe(); }
					});
				}
			},
			complete: () => { subscription.unsubscribe(); } //prevent memory leaks
		});
	}
}
