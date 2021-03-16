import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { AliasPropertyConfig } from '../alias-property.component';

@Component({
  selector: 'app-alias-edit',
  templateUrl: './alias-edit.component.html',
  styleUrls: ['./alias-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AliasEditComponent implements OnInit {
    @Input() public config: AliasPropertyConfig;

    constructor() { }

    ngOnInit(): void {
    }

    public editAlias(aliasName: string) {

    }

    public removeAlias(aliasName: string) {
        console.log("removing alias", aliasName);
        let obj = this.config.object as StixObject;
        // remove from alias field
        obj[this.config.field] = obj[this.config.field].filter((x) => x != aliasName)
        // remove external reference citation
        let references = obj.external_references.serialize();
        references = references.filter((ref) => {
            if (ref.source_name == aliasName) { console.log("removing ref", ref); return false };
            return true;
        });
        obj.external_references.deserialize(references);
        console.log(obj.external_references);
    }

}
