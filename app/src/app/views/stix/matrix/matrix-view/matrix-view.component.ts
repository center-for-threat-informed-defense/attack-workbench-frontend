import { Component, OnDestroy, OnInit } from '@angular/core';
import { Matrix } from 'src/app/classes/stix/matrix';
import { StixViewPage } from '../../stix-view-page';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { Tactic } from 'src/app/classes/stix/tactic';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { EditorService } from 'src/app/services/editor/editor.service';
import { Observable, of } from 'rxjs';

@Component({
	selector: 'app-matrix-view',
	templateUrl: './matrix-view.component.html',
	styleUrls: ['./matrix-view.component.scss']
})
export class MatrixViewComponent extends StixViewPage implements OnInit, OnDestroy {
	public all_tactics: Array<StixObject> = [];
	public matrix_tactics: Array<Tactic> = [];
	public view: string = "side";
	public get matrix(): Matrix { return this.config.object as Matrix; }
	public loading = false;
	private reloadSubscription;

	constructor(private restAPIConnectorService: RestApiConnectorService,
				authenticationService: AuthenticationService,
				public editorService: EditorService) {
		super(authenticationService);
        this.reloadSubscription = this.editorService.onEditingStopped.subscribe({
            next: () => {
				this.loading = true;
				setTimeout(() => { this.loadMatrix() }, 500);
			}
        })
	}

	ngOnInit() {
		this.loadMatrix();
		if (!this.config.hasOwnProperty('showRelationships') || this.config.showRelationships) {
			// all tactics used for adding any possible tactic to matrix
			let allTacticSubscription = this.restAPIConnectorService.getAllTactics().subscribe({
				next: (all_tactics) => {
					this.all_tactics = all_tactics.data;
				},
				complete: () => { allTacticSubscription.unsubscribe(); } //prevent memory leaks
			});
		}
		if (this.matrix.firstInitialized) {
			this.matrix.initializeWithDefaultMarkingDefinitions(this.restAPIConnectorService);
		}
	}

	ngOnDestroy(): void {
		this.reloadSubscription.unsubscribe();
	}

	/**
	 * Load the matrix view
	 */
	public loadMatrix(): void {
		this.loading = true;
		this.getMatrixObjects().subscribe({
			next: (matrix) => {
				this.matrix_tactics = matrix.tactic_objects;
				this.loading = false;
			},
			error: (err) => {
				this.matrix_tactics = [];
				this.loading = false;
			}
		})
	}

	/**
	 * Get all objects in the matrix
	 * @returns the matrix with all tactics and techniques populated
	 */
	public getMatrixObjects(): Observable<any> {
		if (this.matrix.firstInitialized) return of();
		return this.restAPIConnectorService.getTechniquesInMatrix(this.matrix);
	}

	/**
	 * Hide or show all subtechniques in matrix
	 * @param {boolean} value whether or not subtechniques should be visible
	 */
	public toggleAllSubtechniquesVisible(value: boolean) {
		for (let tactic of this.matrix_tactics) {
			for (let technique of tactic.technique_objects) {
				technique.show_subtechniques = value;
			}
		}
	}
}
