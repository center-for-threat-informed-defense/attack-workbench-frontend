import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
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
    public dirty: boolean;
    public stage: number = 0;
    public contributor: string;

    public get editing(): boolean { return this.config.mode == 'edit'; }
    public get editable(): boolean { return this.authenticationService.canEdit(); }
    public get isValid(): boolean {
        return this.contributor?.length > 0 && this.contributor !== this.config.contributor;
    }

    constructor(@Inject(MAT_DIALOG_DATA) public config: ContributorEditConfig,
                public dialogRef: MatDialogRef<ContributorEditDialogComponent>,
                private authenticationService: AuthenticationService,
                private restApiConnector: RestApiConnectorService) { }

    ngOnInit(): void {
        this.contributor = this.config.contributor;
    }

    public close(): void {
        this.dialogRef.close(this.dirty);
    }

    public next(): void {
        // trim contributor field
        this.contributor = this.contributor.trim();

        // parse object patches
        this.stage = 1;
    }

    public discardChanges(): void {
        this.contributor = this.config.contributor;
        this.stopEditing();
    }

    public startEditing(): void {
        this.config.mode = 'edit';
    }

    public stopEditing(): void {
        this.config.mode = 'view';
        this.stage = 0;
    }

    public patch(): void {
        this.stage = 2;
        let saves = [];
        for (let object of this.config.objects) {
            if (object.hasOwnProperty('contributors')) {
                let i = object['contributors'].indexOf(this.config.contributor);
                if (i >= 0) object['contributors'][i] = this.contributor;
                saves.push(object.save(this.restApiConnector));
            }
            let subscription = forkJoin(saves).subscribe({
                complete: () => {
                    this.dirty = true; // triggers refresh
                    this.stopEditing();
                    if (subscription) subscription.unsubscribe();
                }
            })
        }
    }
}

export interface ContributorEditConfig {
    /* What is the current mode? Default: 'view'*/
    mode?: "view" | "edit";
    contributor: string;
    objects: StixObject[];
}