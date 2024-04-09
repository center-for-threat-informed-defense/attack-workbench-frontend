import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-alias-edit-dialog',
  templateUrl: './alias-edit-dialog.component.html',
  styleUrls: ['./alias-edit-dialog.component.scss']
})
export class AliasEditDialogComponent implements OnInit {
    public is_new: boolean = false;
    public aliasDescription: string = "";

    constructor(public dialogRef: MatDialogRef<AliasEditDialogComponent>, @Inject(MAT_DIALOG_DATA) public config: AliasEditDialogConfig) {
        if (config.aliasName) {
            this.is_new = false;
            this.aliasDescription = this.config.object.external_references.hasValue(config.aliasName)? this.config.object.external_references.getReference(config.aliasName).description : "";
        } else {
            this.is_new = true;
            this.config.aliasName = "";
        }
    }

    ngOnInit(): void {
        // intentionally left blank
    }

    /**
     * Set the alias and close the dialog
     */
    public setAlias() {
        // step 1: add the alias to the aliases field
        let aliases = new Set(this.config.object[this.config.field]);
        aliases.add(this.config.aliasName);
        this.config.object[this.config.field] = Array.from(aliases);

        // step 2: add alias description to external reference if a description has been set
        let refs = this.config.object.external_references.serialize();
        // remove previous alias reference if it exists
        refs = refs.filter((ref) => ref.source_name != this.config.aliasName); 
        // append the updated alias if it has a description
        if (this.aliasDescription) {
            refs.push({
                source_name: this.config.aliasName,
                description: this.aliasDescription
            })
        }
        // patch the external references on the object with the new values
        this.config.object.external_references.deserialize(refs);

        this.dialogRef.close();
    }

}

export interface AliasEditDialogConfig {
    aliasName: string;
    object: StixObject;
    field: string;
}
