import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { ValidationData } from 'src/app/classes/serializable';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { VersionNumber } from 'src/app/classes/version-number';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { WorkflowState, WorkflowStates } from 'src/app/utils/types';

@Component({
  selector: 'app-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class SaveDialogComponent implements OnInit {
  public stage = 0;
  public currentVersion: string;
  public nextMajorVersion: string;
  public nextMinorVersion: string;
  public patch_objects = [];
  public validation: ValidationData = null;
  public newState: WorkflowState = 'work-in-progress';
  public workflows = Object.entries(WorkflowStates);

  public get saveEnabled() {
    return this.validation && this.validation.errors.length == 0;
  }

  constructor(
    public dialogRef: MatDialogRef<SaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public config: SaveDialogConfig,
    public restApiService: RestApiConnectorService
  ) {
    this.currentVersion = config.object.version.toString();
    this.nextMajorVersion = config.object.version.nextMajorVersion().toString();
    this.nextMinorVersion = config.object.version.nextMinorVersion().toString();

    const subscription = config.object.validate(this.restApiService).subscribe({
      next: result => {
        // tell the user version has been incremented, but not if the version has an error
        if (
          this.config.versionAlreadyIncremented &&
          !result.errors.some(x => x.field == 'version')
        )
          result.info.push({
            field: 'version',
            result: 'info',
            message: 'version has already been changed',
          });
        this.validation = result;
      },
      complete: () => {
        subscription.unsubscribe();
      },
    });
  }

  ngOnInit(): void {
    this.newState = this.config.initialWorkflowState || 'work-in-progress';
    // Run validation for the initial state
    const subscription = this.config.object
      .validate(this.restApiService, this.newState)
      .subscribe({
        next: result => {
          this.validation = result;
        },
        complete: () => subscription.unsubscribe(),
      });
  }

  onStatusChanged(event) {
    const subscription = this.config.object
      .validate(this.restApiService, event.value)
      .subscribe({
        next: result => {
          this.validation = result;
        },
        complete: () => subscription.unsubscribe(),
      });
  }

  /**
   * Find objects with links to the previous object ATT&CK ID
   */
  private parse_patches(): void {
    this.stage = 1; // enter patching stage
    const objSubscription = this.restApiService
      .getAllObjects({ deserialize: true })
      .subscribe({
        next: results => {
          // find objects with a link to the previous ID
          const objLink = `(LinkById: ${this.config.patchId})`;
          results.data.forEach(x => {
            if (
              x.description?.indexOf(objLink) !== -1 ||
              ('detection' in x && x.detection?.indexOf(objLink) !== -1)
            ) {
              this.patch_objects.push(x);
            }
          });

          // check if the object iself needs to be patched
          if (
            this.config.object.description?.indexOf(objLink) !== -1 ||
            ('detection' in this.config.object &&
              (this.config.object.detection as string)?.indexOf(objLink) !== -1)
          ) {
            this.patchObject(this.config.object); // calls patchObject() directly to avoid saving the object twice
          }

          this.stage = 2;
        },
        complete: () => objSubscription.unsubscribe(),
      });
  }

  private patchObject(obj): void {
    // replace LinkById references with the new ATT&CK ID
    const regex = new RegExp(`\\(LinkById: (${this.config.patchId})\\)`, 'gmu');
    obj.description = obj.description.replace(
      regex,
      `(LinkById: ${this.config.object.attackID})`
    );
    if ('detection' in obj && obj.detection) {
      obj.detection = obj.detection.replace(
        regex,
        `(LinkById: ${this.config.object.attackID})`
      );
    }
  }

  /**
   * Apply LinkById patches and save the object
   */
  public patch() {
    const saves = [];
    for (const obj of this.patch_objects) {
      this.patchObject(obj);
      if (obj.stixID !== this.config.object.stixID)
        saves.push(obj.save(this.restApiService));
    }
    this.stage = 3; // enter loading stage until patching is complete
    const saveSubscription = forkJoin(saves).subscribe({
      complete: () => {
        saveSubscription.unsubscribe();
        this.save();
      },
    });
  }

  /**
   * Save the object with the current version and check for patches
   */
  public saveCurrentVersion() {
    this.config.object.workflow = this.newState
      ? { state: this.newState }
      : undefined;
    if (this.config.patchId) this.parse_patches();
    else this.save();
  }

  /**
   * Save the object with the next minor version (i.e. 1.0 -> 1.1) and check for patches
   */
  public saveNextMinorVersion() {
    this.config.object.version = new VersionNumber(this.nextMinorVersion);
    this.config.object.workflow = this.newState
      ? { state: this.newState }
      : undefined;
    if (this.config.patchId) this.parse_patches();
    else this.save();
  }

  /**
   * Save the object with the next major version (i.e. 1.0 -> 2.0) and check for patches
   */
  public saveNextMajorVersion() {
    this.config.object.version = new VersionNumber(this.nextMajorVersion);
    this.config.object.workflow = this.newState
      ? { state: this.newState }
      : undefined;
    if (this.config.patchId) this.parse_patches();
    else this.save();
  }

  private saveObject() {
    return this.config.object.save(this.restApiService); // save this object
  }

  /**
   * Save the object without patching other objects
   */
  private save() {
    if (!this.saveEnabled) {
      return;
    }
    this.config.object.workflow = { state: this.newState };
    const sub = this.saveObject().subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      complete: () => sub.unsubscribe(),
    });
  }
}

export interface SaveDialogConfig {
  object: StixObject;
  patchId?: string; // previous object ID to patch in LinkByID tags
  versionAlreadyIncremented: boolean;
  initialWorkflowState?: WorkflowState;
}
