import { Component, Input, OnInit } from '@angular/core';
import { TimestampPropertyConfig } from '../timestamp-property.component';
import * as moment from 'moment';

@Component({
  selector: 'app-timestamp-view',
  templateUrl: './timestamp-view.component.html',
  styleUrls: ['./timestamp-view.component.scss']
})
export class TimestampViewComponent implements OnInit {
    @Input() public config: TimestampPropertyConfig;
    
    /**
     *get the formatted timestamp with relative date
     */
    public get humanized(): string {
        let now = moment();
        let then = moment(this.config.object[this.config.field]);
        let difference = moment.duration(then.diff(now));
        if (difference.asWeeks() > -1) {
            // date is in last week, display humanized date
            return difference.humanize(true); // show with suffix, eg "a week ago" instead of "a week"
        } else {
            // date is older, display absolute date
            return then.format('D MMMM YYYY');
        }
    }

    /**
     *get the formatted absolute timestamp with hour/minute
     */
    public get timestamp(): string {
        return moment(this.config.object[this.config.field]).format('D MMMM YYYY, H:mm A')
    }
    
    constructor() { }

    ngOnInit(): void {
        
    }

}
