import { Component, OnDestroy, OnInit } from '@angular/core';
import { Matrix } from 'src/app/classes/stix/matrix';
import { StixViewPage } from '../../stix-view-page';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { Tactic } from 'src/app/classes/stix/tactic';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { EditorService } from 'src/app/services/editor/editor.service';
import { forkJoin, Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-matrix-view',
  templateUrl: './matrix-view.component.html',
  styleUrls: ['./matrix-view.component.scss'],
  standalone: false,
})
export class MatrixViewComponent
  extends StixViewPage
  implements OnInit, OnDestroy
{
  public all_tactics: StixObject[] = [];
  public matrix_tactics: Tactic[] = [];
  public view = 'side';

  public get matrix(): Matrix {
    return this.configCurrentObject as Matrix;
  }
  public get previous(): Matrix {
    return this.configPreviousObject as Matrix;
  }

  public loading = false;
  private reloadSubscription: Subscription;

  constructor(
    private restAPIConnectorService: RestApiConnectorService,
    authenticationService: AuthenticationService,
    public editorService: EditorService
  ) {
    super(authenticationService);
    this.reloadSubscription = this.editorService.onEditingStopped.subscribe({
      next: () => {
        this.loading = true;
        setTimeout(() => {
          this.loadMatrix();
        }, 500);
      },
    });
  }

  ngOnInit() {
    this.loadMatrix();
    if (this.matrix.firstInitialized) {
      this.matrix.initializeWithDefaultMarkingDefinitions(
        this.restAPIConnectorService
      );
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

    const matrix$ = this.getMatrixObjects();
    const allTactics$ = this.restAPIConnectorService.getAllTactics();

    forkJoin({ matrix: matrix$, tactics: allTactics$ }).subscribe({
      next: result => {
        this.matrix_tactics = result.matrix.tactic_objects || [];
        this.all_tactics = result.tactics.data;
      },
      complete: () => {
        this.loading = false;
      },
    });
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
    for (const tactic of this.matrix_tactics) {
      for (const technique of tactic.technique_objects) {
        technique.show_subtechniques = value;
      }
    }
  }
}
