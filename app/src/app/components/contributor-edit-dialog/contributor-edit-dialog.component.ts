import { Component, EventEmitter, Inject, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { StixObject } from 'src/app/classes/stix';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
    selector: 'app-contributor-edit-dialog',
    templateUrl: './contributor-edit-dialog.component.html',
    styleUrls: ['./contributor-edit-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContributorEditDialogComponent implements OnInit {
    @Output() public onSave = new EventEmitter();

    public dirty: boolean;
    public stage: number = 0;
    public contributor: string;

    public get editing(): boolean { return this.config.mode == 'edit'; }
    public get editable(): boolean { return this.authenticationService.canEdit(); }
    public get isValid(): boolean {
        return this.contributor?.trim().length > 0 && this.contributor.trim() !== this.config.contributor;
    }

    constructor(@Inject(MAT_DIALOG_DATA) public config: ContributorEditConfig,
                public dialogRef: MatDialogRef<ContributorEditDialogComponent>,
                private authenticationService: AuthenticationService,
                private restApiConnector: RestApiConnectorService) { }

    ngOnInit(): void {
        this.contributor = this.config.contributor;
    }

    /** Close the dialog window */
    public close(): void {
        this.dialogRef.close(this.dirty);
    }

    /** Move to 'apply patches & save' step */
    public next(): void {
        this.contributor = this.contributor.trim();
        this.stage = 1; // next stage
    }

    /** Discard any edits made to contributor and stop editing */
    public discardChanges(): void {
        this.contributor = this.config.contributor;
        this.stopEditing();
    }

    /** Start editing contributor name */
    public startEditing(): void {
        this.config.mode = 'edit';
    }

    /** Stop editing contributor */
    public stopEditing(): void {
        this.config.mode = 'view';
        this.stage = 0;
    }

    /** Patch 'x_mitre_contributors' field on relevant objects and save */
    public patch(): void {
        this.stage = 2;
        let saves = [];
        for (let object of this.config.objects) {
            if (object.hasOwnProperty('contributors')) {
                let i = object['contributors'].indexOf(this.config.contributor);
                if (i >= 0) object['contributors'][i] = this.contributor;
                saves.push(object.save(this.restApiConnector));
            }
        }
        let subscription = forkJoin(saves).subscribe({
            complete: () => {
                this.onSave.emit(this.contributor); // triggers map update
                this.dirty = true; // triggers refresh
                this.stopEditing();
                if (subscription) subscription.unsubscribe();
            }
        });
    }
}

export interface ContributorEditConfig {
    /* What is the current mode? Default: 'view'*/
    mode?: "view" | "edit";
    contributor: string;
    objects: StixObject[];
}