import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-collection-import',
  templateUrl: './collection-import.component.html',
  styleUrls: ['./collection-import.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionImportComponent implements OnInit {

    public collectionInfo: FormGroup;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.collectionInfo = this.formBuilder.group({
            url: [''],
            upload: [{value: undefined}]
        }, { validator: atLeastOneValidator(Validators.required, ["url", "upload"])});
    }

}

const atLeastOneValidator = (validator: ValidatorFn, controls:string[] = null) => (group:FormGroup): ValidationErrors | null => {
    if (!controls) controls = Object.keys(group.controls);
    const hasAtLeastOne = group && group.controls && controls.some(k => !validator(group.controls[k]));
    return hasAtLeastOne ? null : { "atLeastOne": true };
}