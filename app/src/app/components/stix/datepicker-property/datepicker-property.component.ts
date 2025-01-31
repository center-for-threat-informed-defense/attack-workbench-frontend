import { Component, Input } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Moment } from 'moment';
import * as moment from 'moment';

// Date formatting from Angular documentation: emulating a year and month picker
// https://v10.material.angular.io/components/datepicker/overview
// https://momentjs.com/docs/#/displaying/format/

export const DATE_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY', // date input format
  },
  display: {
    dateInput: 'MM/YYYY', // format for displaying selected date
    monthYearLabel: 'MMM YYYY', // datepicker display format
    dateA11yLabel: 'LL', // format read by screen readers during day selection
    monthYearA11yLabel: 'MMMM YYYY', // format read by screen readers during month selection
  },
};

@Component({
    selector: 'app-datepicker-property',
    templateUrl: './datepicker-property.component.html',
    styleUrls: ['./datepicker-property.component.scss'],
    providers: [
        // date format providers
        {
          provide: DateAdapter,
          useClass: MomentDateAdapter,
          deps: [ MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS ]
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: DATE_FORMATS
        }
      ],
})

export class DatepickerPropertyComponent {
    @Input() public config: DatepickerPropertyConfig;
    public maxDate: Date;

    public get object() {
      return Array.isArray(this.config.object) ? this.config.object[0] : this.config.object;
    }

    public get formatHint() { return DATE_FORMATS.parse.dateInput; }
    public get date() { // get date in view display format (i.e. January 2022)
        if (this.object[this.config.field]) {
            return moment.utc(this.object[this.config.field]).format('MMMM YYYY');
        }
        return null;
    }

    public get before() {
      let d = this.config.object[0]?.[this.config.field];
      return moment.utc(d).format('MMMM YYYY');
    }

    public get after() {
      let d = this.config.object[1]?.[this.config.field];
      return moment.utc(d).format('MMMM YYYY');
    }

    constructor() {
        // set the maximum date to today
        this.maxDate = new Date();
    }

    // event handler for datepicker month selection
    public monthSelected(event: Moment, datepicker: MatDatepicker<Moment>) {
        this.config.object[this.config.field] = event;
        datepicker.close();
    }
}

export interface DatepickerPropertyConfig {
    /* What is the current mode? Default: 'view'
     *    view: viewing the date property
     *    edit: editing the date property
     */
    mode?: "view" | "edit" | "diff";
    /* The object to show the date of */
    object: StixObject | [StixObject, StixObject];
    /* the field of the object(s) to show as a date */
    field: string;
    /* if specified, label with this string instead of field */
    label?: string;
    /* If true, the field will be required. Default false if omitted. */
    required?: boolean;
}