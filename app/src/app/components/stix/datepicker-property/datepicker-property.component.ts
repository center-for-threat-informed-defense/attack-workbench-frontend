import { Component, Input } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';
import * as moment from 'moment';

@Component({
    selector: 'app-datepicker-property',
    templateUrl: './datepicker-property.component.html',
    styleUrls: ['./datepicker-property.component.scss']
})

export class DatepickerPropertyComponent {
    @Input() public config: DatepickerPropertyConfig;

    public get date() {
        let m = moment(this.config.object[this.config.field]);
        return m.format(this.config.dateFormat ? this.config.dateFormat : 'MM/DD/YYYY');
    }

    constructor() {
        // intentionally left blank
    }

    public setDate(event: moment.Moment, datepicker: any) {
        this.config.object[this.config.field] = event;
        datepicker.close();
    }
}

export interface DatepickerPropertyConfig {
    /* What is the current mode? Default: 'view'
     *    view: viewing the date property
     *    edit: editing the date property
     */
    mode?: "view" | "edit";
    /* The object to show the date of */
    object: StixObject | [StixObject, StixObject];
    /* the field of the object(s) to show as a date */
    field: string;
    /* if specified, label with this string instead of field */
    label?: string;
    /* if specified, display the date according to this format */
    dateFormat?: string;
}