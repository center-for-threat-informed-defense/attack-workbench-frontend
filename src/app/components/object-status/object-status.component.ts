import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Relationship } from 'src/app/classes/stix/relationship';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { EditorService } from 'src/app/services/editor/editor.service';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-object-status',
  templateUrl: './object-status.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ObjectStatusComponent implements OnInit {
  public loaded = false;
  public statusControl: FormControl<string>;
  public select: SelectionModel<string>;
  public workflows: string[] = [
    'none',
    'work-in-progress',
    'awaiting-review',
    'reviewed',
  ];
  public objects: StixObject[];
  public object: StixObject;
  public relationships = [];
  public revoked = false;
  public deprecated = false;

  public get disabled(): boolean {
    return (
      this.editorService.editing || this.editorService.type == 'collection'
    );
  }

  constructor(
    public editorService: EditorService,
    private restAPIService: RestApiConnectorService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.statusControl = new FormControl();
  }

  public loadData() {
    let data$: any;
    const options = {
      includeRevoked: true,
      includeDeprecated: true,
    };
    if (this.editorService.stixId && this.editorService.stixId != 'new') {
      // don't load if the object doesn't exist yet
      // retrieve object
      if (this.editorService.type == 'software')
        data$ = this.restAPIService.getAllSoftware(options);
      else if (this.editorService.type == 'group')
        data$ = this.restAPIService.getAllGroups(options);
      else if (this.editorService.type == 'matrix')
        data$ = this.restAPIService.getAllMatrices(options);
      else if (this.editorService.type == 'mitigation')
        data$ = this.restAPIService.getAllMitigations(options);
      else if (this.editorService.type == 'tactic')
        data$ = this.restAPIService.getAllTactics(options);
      else if (this.editorService.type == 'campaign')
        data$ = this.restAPIService.getAllCampaigns(options);
      else if (this.editorService.type == 'technique')
        data$ = this.restAPIService.getAllTechniques(options);
      else if (this.editorService.type == 'collection')
        data$ = this.restAPIService.getAllCollections(options);
      else if (this.editorService.type == 'data-source')
        data$ = this.restAPIService.getAllDataSources(options);
      else if (this.editorService.type == 'data-component')
        data$ = this.restAPIService.getAllDataComponents(options);
      else if (this.editorService.type == 'asset')
        data$ = this.restAPIService.getAllAssets(options);
      const objSubscription = data$.subscribe({
        next: data => {
          this.objects = data.data;
          this.object = this.objects.find(
            object => object.stixID === this.editorService.stixId
          );
          if (this.object) {
            if (this.object.workflow?.state) {
              this.statusControl.setValue(this.object.workflow.state);
            }
            this.revoked = this.object.revoked;
            this.deprecated = this.object.deprecated;
          }
        },
        complete: () => {
          objSubscription.unsubscribe();
        },
      });

      if (this.editorService.type == 'data-source') {
        // retrieve related data components & their relationships
        data$ = this.restAPIService.getAllRelatedToDataSource(
          this.editorService.stixId
        );
        const dataSubscription = data$.subscribe({
          next: results => {
            this.relationships = this.relationships.concat(results);
          },
          complete: () => {
            dataSubscription.unsubscribe();
          },
        });
      }

      // retrieve relationships with the object
      data$ = this.restAPIService.getRelatedTo({
        sourceOrTargetRef: this.editorService.stixId,
      });
      const relSubscription = data$.subscribe({
        next: data => {
          const relationships = data.data as Relationship[];
          this.relationships = this.relationships.concat(relationships);
          this.loaded = true;
        },
        complete: () => {
          relSubscription.unsubscribe();
        },
      });
    }
  }

  private save() {
    const saveSubscription = this.object.save(this.restAPIService).subscribe({
      complete: () => {
        this.editorService.onReload.emit();
        saveSubscription.unsubscribe();
      },
    });
  }

  /**
   * Handle workflow state change
   * @param event workflow state selection
   */
  public workflowChange(event) {
    if (event.isUserInput) {
      if (event.source.value == 'none') this.object.workflow = undefined;
      else this.object.workflow = { state: event.source.value };
      this.save();
    }
  }

  public getLabel(status: string): string {
    return status.replace(/-/g, ' ');
  }

  /**
   * Handle the selection for revoking or un-revoking an object
   * @param event revoke selection
   */
  public revoke(event) {
    if (event.checked) {
      // revoke object
      // prompt for revoking object
      this.select = new SelectionModel<string>();
      const revokedDialog = this.dialog.open(AddDialogComponent, {
        maxWidth: '70em',
        maxHeight: '70em',
        data: {
          selectableObjects: this.objects.filter(object => {
            return object.stixID !== this.editorService.stixId;
          }),
          type: this.editorService.type,
          select: this.select,
          selectionType: 'one',
          title: 'Select the revoking object',
          buttonLabel: 'revoke',
        },
        autoFocus: false, // prevents auto focus on toolbar buttons
      });
      const revokedSubscription = revokedDialog.afterClosed().subscribe({
        next: result => {
          if (result && this.select.selected.length) {
            // target object selected
            const target_id = this.select.selected[0];
            this.deprecateObjects(true, target_id);
          } else {
            // user cancelled or no object selected
            this.revoked = false;
          }
        },
        complete: () => {
          revokedSubscription.unsubscribe();
        },
      });
    } else {
      // unrevoke object, deprecate the 'revoked-by' relationship
      // this is the only case in which a 'revoked-by' relationship is deprecated
      const revokedRelationship = this.relationships.find(
        r =>
          r.relationship_type == 'revoked-by' &&
          r.source_ref == this.object.stixID
      );
      if (revokedRelationship) {
        revokedRelationship.deprecated = true;
        revokedRelationship.save(this.restAPIService);
      }
      this.object.revoked = false;
      this.save();
    }
  }

  /**
   * Handle the selection for deprecating or un-deprecating an object
   * @param event deprecate selection
   */
  public deprecate(event) {
    if (event.checked) {
      this.deprecateObjects(false);
    } else {
      this.object.deprecated = false;
      this.save();
    }
  }

  /**
   * Deprecates or revokes the object and deprecates all relationships with this object,
   * with the exception of 'subtechnique-of' relationships
   */
  private deprecateObjects(revoked: boolean, revoked_by_id?: string) {
    const saves = [];

    // inform users of relationship changes
    const confirmationPrompt = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '35em',
      data: {
        message:
          'All relationships with this object will be deprecated. Do you want to continue?',
      },
      autoFocus: false, // prevents auto focus on toolbar buttons
    });

    const confirmationSub = confirmationPrompt.afterClosed().subscribe({
      next: result => {
        if (!result) {
          // user cancelled
          if (revoked) this.revoked = false;
          else this.deprecated = false;
          return;
        }

        // deprecate or revoke object
        if (revoked) this.object.revoked = true;
        else this.object.deprecated = true;
        saves.push(this.object.save(this.restAPIService));

        // update relationships with the object
        for (const relationship of this.relationships) {
          // do not deprecate 'subtechnique-of' or 'revoked-by' relationships
          if (
            !relationship.deprecated &&
            !['subtechnique-of', 'revoked-by'].includes(
              relationship.relationship_type
            )
          ) {
            relationship.deprecated = true;
            saves.push(relationship.save(this.restAPIService));
          }
        }

        if (revoked_by_id) {
          // create a new 'revoked-by' relationship
          const revokedRelationship = new Relationship();
          revokedRelationship.relationship_type = 'revoked-by';
          revokedRelationship.source_ref = this.object.stixID;
          revokedRelationship.target_ref = revoked_by_id;
          saves.push(revokedRelationship.save(this.restAPIService));
        }

        // complete save calls
        const saveSubscription = forkJoin(saves).subscribe({
          complete: () => {
            this.editorService.onReload.emit();
            saveSubscription.unsubscribe();
          },
        });
      },
      complete: () => {
        confirmationSub.unsubscribe();
      },
    });
  }
}
