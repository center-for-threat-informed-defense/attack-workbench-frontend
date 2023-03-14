import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { AliasPropertyConfig } from '../alias-property.component';
import { AliasEditDialogComponent } from './alias-edit-dialog/alias-edit-dialog.component';

@Component({
  selector: 'app-alias-edit',
  templateUrl: './alias-edit.component.html',
  styleUrls: ['./alias-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AliasEditComponent implements OnInit {
    @Input() public config: AliasPropertyConfig;
    public attackType: string;

    constructor(public dialog: MatDialog) { }

    ngOnInit(): void {
        let object = Array.isArray(this.config.object)? this.config.object[0] : this.config.object;
        this.attackType = object.attackType;
    }

    public editAlias(aliasName?: string) {
        let ref = this.dialog.open(AliasEditDialogComponent, {
            maxHeight: "75h",
            data: {
                object: this.config.object,
                field: this.config.field,
                aliasName: aliasName
            }
        })
        let subscription = ref.afterClosed().subscribe({
            complete: () => {
                subscription.unsubscribe();
            }
        })
    }

    public removeAlias(aliasName: string) {
        let obj = this.config.object as StixObject;
        // remove from alias field
        obj[this.config.field] = obj[this.config.field].filter((x) => x != aliasName)
        // remove external reference citation
        let references = obj.external_references.serialize();
        references = references.filter((ref) => {
            if (ref.source_name == aliasName) { return false; }
            return true;
        });
        obj.external_references.deserialize(references);
    }

}
