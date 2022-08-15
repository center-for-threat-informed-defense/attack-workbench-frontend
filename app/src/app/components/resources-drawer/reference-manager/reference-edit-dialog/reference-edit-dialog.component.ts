import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { ExternalReference } from 'src/app/classes/external-references';
import { Relationship } from 'src/app/classes/stix/relationship';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-reference-edit-dialog',
  templateUrl: './reference-edit-dialog.component.html',
  styleUrls: ['./reference-edit-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReferenceEditDialogComponent implements OnInit {
    public reference: ExternalReference;
    public is_new: boolean;
    public stage: number = 0;
    public patch_objects: StixObject[];
    public patch_relationships: Relationship[];

    public months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    public citation: any = {};

    public get citationTag(): string { return `(Citation: ${this.reference.source_name})`; }

    constructor(public dialogRef: MatDialogRef<ReferenceEditDialogComponent>, @Inject(MAT_DIALOG_DATA) public config: ReferenceEditConfig, public restApiConnectorService: RestApiConnectorService, public snackbar: MatSnackBar) {
        if (this.config.reference) {
            this.is_new = false;
            this.reference = JSON.parse(JSON.stringify(this.config.reference)); //deep copy
        }
        else {
            this.is_new = true;
            this.citation.day = new FormControl(null, [Validators.max(31), Validators.min(1)]);
            this.citation.year = new FormControl(null, [Validators.max(2100), Validators.min(1970)]);
            this.citation.retrieved = new Date(); // default to current date
            this.reference = {
                source_name: "",
                url: "",
                description: ""
            }
        }
    }

    ngOnInit(): void {
    } 

    public next() {
        // trim reference fields
        this.reference.url = this.reference.url.trim();

        if (this.is_new) { // save new reference
            this.reference.source_name = this.reference.source_name.trim(); // trim source_name only if this is a new reference
            this.reference.description = this.getRefDescription();
            this.save();
        } else this.parse_patches(); // check for necessary patches on STIX objects
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
        // retrieve all objects, including revoked & deprecated to create object lookup map
        let subscription = this.restApiConnectorService.getAllObjects(null, null, null, null, true, true, true).subscribe({
            next: (results) => {
                // build ID to [name, attackID] lookup
                let idToObject = {}
                results.data.forEach(x => { idToObject[x.stixID] = x });
                // find objects with given reference
                this.patch_objects = [];
                this.patch_relationships = [];
                results.data.forEach(x => {
                    if (x.revoked || x.deprecated) return; // do not patch revoked/deprecated objects
                    if (x.external_references.hasValue(this.reference.source_name)) {
                        if (x.attackType == 'relationship') this.patch_relationships.push(x);
                        else this.patch_objects.push(x);
                    }
                });
                // patch relationship source/target names and IDs
                this.patch_relationships.map(x => {
                    let serialized = x.serialize();
                    serialized.source_object = idToObject[x.source_ref].serialize();
                    serialized.target_object = idToObject[x.target_ref].serialize();
                    return x.deserialize(serialized);
                });
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
                this.toggle('view');
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
                this.toggle('view');
                subscription.unsubscribe();
            }
        });
    }

    /**
     * change the current mode
     * @param mode 'view' or 'edit'
     */
    public toggle(mode: 'view' | 'edit') {
        this.config.mode = mode;
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