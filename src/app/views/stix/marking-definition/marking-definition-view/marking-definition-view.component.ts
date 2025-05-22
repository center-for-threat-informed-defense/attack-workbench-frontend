import { Component, ViewEncapsulation } from '@angular/core';
import { MarkingDefinition } from 'src/app/classes/stix/marking-definition';
import { StixViewPage } from '../../stix-view-page';
import { MatDialog } from '@angular/material/dialog';
import { ValidationData } from 'src/app/classes/serializable';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';

@Component({
  selector: 'app-marking-definition-view',
  templateUrl: './marking-definition-view.component.html',
  styleUrls: ['./marking-definition-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class MarkingDefinitionViewComponent extends StixViewPage {
  public get markingDefinition(): MarkingDefinition {
    return this.configCurrentObject as MarkingDefinition;
  }
  public validating = false;
  public validationData: ValidationData = null;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private restApiConnector: RestApiConnectorService,
    authenticationService: AuthenticationService
  ) {
    super(authenticationService);
  }

  /**
   * Enable save only during creation of marking definition
   */
  public get saveEnabled() {
    return this.validationData && this.validationData.errors.length == 0;
  }

  /**
   * Trigger marking definition validation and save behaviors
   *
   * @memberof MarkingDefinitionViewComponent
   */
  public validate() {
    this.validating = true;
    this.validationData = null;
    const subscription = this.markingDefinition
      .validate(this.restApiConnector)
      .subscribe({
        next: results => (this.validationData = results),
        complete: () => subscription.unsubscribe(),
      });
  }

  /**
   * Trigger save of marking definition after validation
   *
   */
  public save() {
    const prompt = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '35em',
      data: {
        message:
          'Are you sure you want to save this statement? You cannot modify it after saving',
      },
      autoFocus: false, // prevents auto focus on buttons
    });

    const subscriptionPrompt = prompt.afterClosed().subscribe({
      next: result => {
        if (result) {
          const subscriptionSave = this.markingDefinition
            .save(this.restApiConnector)
            .subscribe({
              next: saveResult => {
                this.router.navigate([
                  saveResult.attackType,
                  saveResult.stixID,
                ]);
                this.validating = false;
              },
              complete: () => {
                subscriptionSave.unsubscribe();
              },
            });
        }
      },
      complete: () => {
        subscriptionPrompt.unsubscribe();
      }, //prevent memory leaks
    });
  }
}
