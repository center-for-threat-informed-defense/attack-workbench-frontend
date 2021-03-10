import { Component, OnInit, Input, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { DescriptivePropertyConfig } from '../descriptive-property.component';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { ViewChild } from '@angular/core'

@Component({
  selector: 'app-descriptive-edit',
  templateUrl: './descriptive-edit.component.html',
  styleUrls: ['./descriptive-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DescriptiveEditComponent implements OnInit {
    @Input() public config: DescriptivePropertyConfig;
    @ViewChild('descriptiveFormField') private formField : MatFormField;

    public preview : boolean = false;

    constructor() { }

    ngOnInit(): void {
    }
}
