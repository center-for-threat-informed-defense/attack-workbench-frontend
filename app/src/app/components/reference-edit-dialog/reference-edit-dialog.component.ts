import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Observable, of, Subscription, throwError } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ExternalReference } from 'src/app/classes/external-references';
import { Relationship } from 'src/app/classes/stix/relationship';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-reference-edit-dialog',
  templateUrl: './reference-edit-dialog.component.html',
  styleUrls: ['./reference-edit-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReferenceEditDialogComponent implements OnInit, OnDestroy {
    public reference: ExternalReference;
    public is_new: boolean;
    public stage: number = 0;
    public patch_objects: StixObject[];
    public patch_relationships: Relationship[];
    public dirty: boolean;

    public references$: ExternalReference[];
    public source_control: FormControl;
    public validationSubscription: Subscription;

    public months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    public citation: any = {};

    public get citationTag(): string { return `(Citation: ${this.reference.source_name})`; }
    public get editing(): boolean { return this.config.mode == 'edit'; }
    public get editable(): boolean { return this.authenticationService.canEdit(); }

    constructor(@Inject(MAT_DIALOG_DATA) public config: ReferenceEditConfig,
                public dialogRef: MatDialogRef<ReferenceEditDialogComponent>,
                public restApiConnectorService: RestApiConnectorService,
                public snackbar: MatSnackBar,
                private authenticationService: AuthenticationService) {
        if (this.config.reference) {
            this.is_new = false;
            this.reference = JSON.parse(JSON.stringify(this.config.reference)); //deep copy
        }
        else {
            this.is_new = true;
            this.citation.day = new FormControl(null, [Validators.max(31), Validators.min(1)]);
            this.citation.year = new FormControl(null, [Validators.max(new Date().getFullYear()), Validators.min(1970)]);
            this.citation.retrieved = new Date(); // default to current date
            this.reference = {
                source_name: "",
                url: "",
                description: ""
            }
            this.source_control = new FormControl(null);
        }
    }

    ngOnInit(): void {
        // retrieve all references
        let referenceSubscription = this.restApiConnectorService.getAllReferences().subscribe({
            next: (data) => {
                this.references$ = data.data;
            },
            complete: () => referenceSubscription.unsubscribe()
        })

        // listen to source_name input changes
        this.validationSubscription = this.source_control.valueChanges.subscribe(source_name => {
            this.validate(this.source_control.value).subscribe({
                error: (err) => { if (err) this.source_control.setErrors(err); }
            })
        })
    }

    ngOnDestroy(): void {
        if (this.validationSubscription) this.validationSubscription.unsubscribe();
    }

    public next() {
        if (this.is_new) {
            this.reference.description = this.getRefDescription();
            this.save();
        } else this.parse_patches();
    }

    public validDate(): boolean {
        if (this.is_new) {
            if (this.citation.day.value && !this.citation.day.valid) return false;
            if (this.citation.year.value && !this.citation.year.valid) return false;
            if (this.citation.day.value && !this.citation.month) return false;
            if (this.citation.month && !this.citation.year.value) return false;
        }
        return true;
    }

    public getRefDescription(): string {
        let description = '';
        if (this.citation.authors) description = `${this.citation.authors}. `;
        description += '(';
        if (this.citation.year.value || this.citation.month || this.citation.day.value) {
            if (this.citation.year.value) description += `${this.citation.year.value}`;
            if (this.citation.year.value && this.citation.month) description += ', ';
            if (this.citation.month) description += this.citation.month;
            if (this.citation.day.value) description += ` ${this.citation.day.value}`;
        } else description += 'n.d.';
        description += ('). ')

        if (this.citation.title) description += `${this.citation.title}. `;
        if (this.citation.retrieved) description += `Retrieved ${this.months[this.citation.retrieved.getMonth()]} ${this.citation.retrieved.getDate()}, ${this.citation.retrieved.getFullYear()}.`;
        return description;
    }

    public parse_patches() {
        this.stage = 1; //enter patching stage
        let subscription = this.restApiConnectorService.getAllObjects(null, null, null, null, true, true, true).subscribe({
            next: (results) => {
                // build ID to [name, attackID] lookup
                let idToObject = {}
                results.data.forEach(x => { idToObject[x.stixID] = x });
                // find objects with given reference
                this.patch_objects = [];
                this.patch_relationships = [];
                results.data.forEach(x => {
                    if (x.external_references.hasValue(this.reference.source_name)) {
                        if (x.attackType == 'relationship') this.patch_relationships.push(x);
                        else this.patch_objects.push(x);
                    }
                });
                // patch relationship source/target names and IDs
                this.patch_relationships.forEach(relationship => {
                    let serialized = relationship.serialize();
                    serialized.source_object = idToObject[relationship.source_ref].serialize();
                    serialized.target_object = idToObject[relationship.target_ref].serialize();
                    relationship.deserialize(serialized);
                })
                this.stage = 2;
            },
            complete: () => { subscription.unsubscribe(); }
        })
    }

    /**
     * Apply patches and save the reference
     */
    public patch() {
        let saves = []
        saves.push(this.restApiConnectorService.putReference(this.reference));
        for (let object of this.patch_objects) {
            let raw = object.external_references.serialize();
            for (let reference of raw) {
                if (reference.source_name == this.reference.source_name) {
                    reference.url = this.reference.url;
                    reference.description = this.reference.description
                }
            }
            object.external_references.deserialize(raw);
            saves.push(object.save(this.restApiConnectorService));
        }
        for (let relationship of this.patch_relationships) {
            let raw = relationship.external_references.serialize();
            raw = raw.map(x => {
                if (x.source_name == this.reference.source_name) return this.reference;
                else return x;
            })
            relationship.external_references.deserialize(raw);
            saves.push(relationship.save(this.restApiConnectorService));
        }
        this.stage = 3;
        let subscription = forkJoin(saves).subscribe({
            complete: () => {
                this.dirty = true; // triggers refresh of object list
                this.stopEditing();
                subscription.unsubscribe();
            }
        })
    }

    /**
     * Save the reference without patching objects using the reference
     */
    public save() {
        let api = this.is_new? this.restApiConnectorService.postReference(this.reference) : this.restApiConnectorService.putReference(this.reference);
        let subscription = api.subscribe({
            complete: () => {
                this.is_new = false;
                this.dirty = true; // triggers refresh of object list
                this.stopEditing();
                subscription.unsubscribe();
            }
        });
    }

    /**
     * Validate reference source name
     * @param source_name the source name input
     * @returns 
     */
    public validate(source_name): Observable<ValidationErrors> {
        this.source_control.setErrors(null); // clear previous validation
        // required
        if (!source_name) return throwError({required: true});

        // cannot contain parenthesis
        let regex = /(\(|\))/g;
        if (regex.test(source_name)) return throwError({containsInvalidChar: true});

        // uniqueness
        if (this.references$.some(x => x.source_name == source_name)) return throwError({nonUnique: true});

        return of();
    }

    /** Retrieve the validation error for display */
    public getError(): string {
        if (this.source_control.errors.containsInvalidChar) return 'source name cannot contain parenthesis';
        if (this.source_control.errors.nonUnique) return 'source name is not unique';
    }

    public stopEditing(): void {
        this.config.mode = 'view';
        this.stage = 0;
    }

    public startEditing(): void {
        this.config.mode = 'edit';
    }

    public discardChanges(): void {
        this.reference = JSON.parse(JSON.stringify(this.config.reference)); //deep copy
        this.stopEditing();
    }

    public close(): void {
        this.dialogRef.close(this.dirty);
    }
}

export interface ReferenceEditConfig {
    /* What is the current mode? Default: 'view'
    *    view: viewing the reference
    *    edit: editing the reference
    */
    mode?: "view" | "edit";
    reference?: ExternalReference
}