import { Component, Input, OnInit } from '@angular/core';
import { ListPropertyConfig } from '../list-property.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-edit',
  templateUrl: './list-edit.component.html',
  styleUrls: ['./list-edit.component.scss']
})
export class ListEditComponent implements OnInit {
    @Input() public config: ListPropertyConfig;

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    public selectList: string[] = [
        'Windows',
        'Linux',
        'macOS',
        'AWS',
        'GCP',
        'Azure',
        'SaaS',
        'Office 365'
    ]
    public selectControl: FormControl;

    constructor(public dialog: MatDialog) { }

    ngOnInit(): void {
        console.log(this.config.object[this.config.field])
        if (this.config.control && this.config.control == 'select') {
            // TODO: this.selectList = ?
            this.selectControl = new FormControl(this.config.object[this.config.field]);
        } else if (this.config.control && this.config.control == 'stix') {
            // TODO: let stixList = ?
        }
    }

    /** Add value to object property list */
    public add(event: MatChipInputEvent): void {
        if (event.value && event.value.trim()) {
            this.config.object[this.config.field].push(event.value.trim());
        }
        if (event.input) {
            event.input.value = ''; // reset input value
        }
    }

    /** Remove value from object property list */
    public remove(value: string): void {
        let i = this.config.object[this.config.field].indexOf(value);
        if (i >= 0) {
            this.config.object[this.config.field].splice(i, 1);
        }
    }

    /** Remove selection from via chip cancel button */
    public removeSelection(value: string): void {
        let values = this.selectControl.value as string[];
        let i = values.indexOf(value);
        if (i >= 0) {
            values.splice(i, 1);
        }
        this.selectControl.setValue([]); // reset selection
        this.selectControl.setValue(values); 
        this.remove(value); // remove value from object property
    }

    /** Add or remove selection from object property list via select-list */
    public change(event: MatOptionSelectionChange): void {
        if (event.isUserInput) {
            if (event.source.selected) this.config.object[this.config.field].push(event.source.value);
            else this.remove(event.source.value);
        }
    }
}