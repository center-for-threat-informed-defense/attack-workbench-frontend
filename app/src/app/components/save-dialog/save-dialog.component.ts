import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { ValidationData } from 'src/app/classes/serializable';
import { StixObject, workflowStates } from 'src/app/classes/stix/stix-object';
import { VersionNumber } from 'src/app/classes/version-number';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { Relationship } from '../../classes/stix/relationship';

@Component({
  selector: 'app-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaveDialogComponent implements OnInit {
    public stage: number = 0;
    public currentVersion: string;
    public nextMajorVersion: string;
    public nextMinorVersion: string;
    public patch_objects = [];
    public validation: ValidationData = null;
    public newState: workflowStates = "work-in-progress";
    public workflows: string[] = ["work-in-progress", "awaiting-review", "reviewed"];

    public get saveEnabled() {
        return this.validation && this.validation.errors.length == 0;
    }

    constructor(public dialogRef: MatDialogRef<SaveDialogComponent>, @Inject(MAT_DIALOG_DATA) public config: SaveDialogConfig, public restApiConnectorService: RestApiConnectorService) {
        this.currentVersion = config.object.version.toString();
        this.nextMajorVersion = config.object.version.nextMajorVersion().toString();
        this.nextMinorVersion = config.object.version.nextMinorVersion().toString();
        
        let subscription = config.object.validate(this.restApiConnectorService).subscribe({
            next: (result) => { 
                // tell the user version has been incremented, but not if the version has an error
                if (this.config.versionAlreadyIncremented && !result.errors.some((x) => x.field == "version")) result.info.push({
                    "field": "version",
                    "result": "info",
                    "message": "version has already been changed"
                })
                this.validation = result;
            },
            complete: () => { subscription.unsubscribe(); }
        })
    }

    ngOnInit(): void {
        this.newState = this.config.object.workflow? this.config.object.workflow.state : "";
    }

    /**
     * Find objects with links to the previous object ATT&CK ID
     */
    private parse_patches(): void {
        this.stage = 1; // enter patching stage
        let objSubscription = this.restApiConnectorService.getAllObjects(null, null, null, null, null, null, true).subscribe({
            next: (results) => {
                // find objects with a link to the previous ID
                let objLink = `(LinkById: ${this.config.patchID})`;
                results.data.forEach(x => {
                    if ((x.description && x.description.indexOf(objLink) !== -1) || ("detection" in x && x.detection && x.detection.indexOf(objLink) !== -1)) {
                            this.patch_objects.push(x);
                    }
                });
                this.stage = 2;
            },
            complete: () => objSubscription.unsubscribe()
        })
    }

    /**
     * Apply LinkById patches and save the object
     */
    public patch() {
        let saves = [];
        saves.push(this.config.object.save(this.restApiConnectorService));
        for (let obj of this.patch_objects) {
            // replace LinkById references with the new ATT&CK ID
            let regex = new RegExp(`\\(LinkById: (${this.config.patchID})\\)`, "gmu");
            obj.description = obj.description.replace(regex, `(LinkById: ${this.config.object.attackID})`);
            if (obj.hasOwnProperty("detection") && obj.detection) {
                obj.detection = obj.detection.replace(regex, `(LinkById: ${this.config.object.attackID})`);
            }
            saves.push(obj.save(this.restApiConnectorService));
        }
        this.stage = 3; // enter loading stage until patching is complete
        let saveSubscription = forkJoin(saves).subscribe({
            complete: () => { saveSubscription.unsubscribe(); this.dialogRef.close(true); }
        })
    }

    /**
     * Save the object with the current version and check for patches
     */
    public saveCurrentVersion() {
        this.config.object.workflow = this.newState ? {state: this.newState } : undefined;
        if (this.config.patchID) this.parse_patches();
        else this.save();
    }

    /**
     * Save the object with the next minor version (i.e. 1.0 -> 1.1) and check for patches
     */
     public saveNextMinorVersion() {
        this.config.object.version = new VersionNumber(this.nextMinorVersion);
        this.config.object.workflow = this.newState ? {state: this.newState } : undefined;
        if (this.config.patchID) this.parse_patches();
        else this.save();
    }

    /**
     * Save the object with the next major version (i.e. 1.0 -> 2.0) and check for patches
     */
    public saveNextMajorVersion() {
        this.config.object.version = new VersionNumber(this.nextMajorVersion);
        this.config.object.workflow = this.newState ? {state: this.newState } : undefined;
        if (this.config.patchID) this.parse_patches();
        else this.save();
    }

    /**
     * Save the object without patching other objects
     */
    private save() {
        if (!this.saveEnabled) { return; }
        const subscription = this.config.object.save(this.restApiConnectorService).subscribe({
            next: (result) => {
                this.dialogRef.close(true);
                // if saving a sub-technique, also create a relationship between parentTechnique & sub techniques
                if (result.attackType === 'technique') {
                    if (result.is_subtechnique && this.config.object.parentTechnique) {
                      const relationship = new Relationship();
                      relationship.relationship_type = 'subtechnique-of';
                      relationship.set_source_object(result, this.restApiConnectorService);
                      relationship.set_target_object(this.config.object.parentTechnique, this.restApiConnectorService);
                      relationship.save(this.restApiConnectorService);
                    }
                }
            },
            complete: () => {subscription.unsubscribe(); }
        });
    }

    public getLabel(status: string): string {
        return status.replace(/-/g, ' ');
    }
}

export interface SaveDialogConfig {
    object: StixObject;
    patchID?: string; // previous object ID to patch in LinkByID tags
    versionAlreadyIncremented: boolean;
}
