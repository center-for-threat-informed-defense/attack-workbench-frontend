import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ValidationData, ValidationFieldData } from 'src/app/classes/serializable';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { VersionNumber } from 'src/app/classes/version-number';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaveDialogComponent implements OnInit {

    public currentVersion: string;
    public nextMajorVersion: string;
    public nextMinorVersion: string;
    public validation: ValidationData = null;

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

    public saveCurrentVersion() {
        this.save();
    }

    public saveNextMajorVersion() {
        this.config.object.version = new VersionNumber(this.nextMajorVersion)
        this.save();
    }

    public saveNextMinorVersion() {
        this.config.object.version = new VersionNumber(this.nextMinorVersion)
        this.save();
    }

    private save() {
        if (!this.saveEnabled) return;
        let subscription = this.config.object.save(this.restApiConnectorService).subscribe({
            next: (result) => { 
                this.dialogRef.close(true);
            },
            complete: () => {subscription.unsubscribe(); }
        });
    }

    ngOnInit(): void {
    }

}

export interface SaveDialogConfig {
    object: StixObject;
    versionAlreadyIncremented: boolean;
}
