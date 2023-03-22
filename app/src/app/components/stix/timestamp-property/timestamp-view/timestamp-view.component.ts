import { Component, Input, OnInit } from '@angular/core';
import { TimestampPropertyConfig } from '../timestamp-property.component';
import * as moment from 'moment';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-timestamp-view',
    templateUrl: './timestamp-view.component.html',
    styleUrls: ['./timestamp-view.component.scss']
})
export class TimestampViewComponent implements OnInit {
    @Input() public config: TimestampPropertyConfig;

    private _humanized: string = null;
    private userSubscription$: Subscription;
    displayName: string = '';

    constructor(private restAPIConnector: RestApiConnectorService) {
        // intentionally left blank
    }

    ngOnInit(): void {
      if (this.config.displayCreatorUsernameWithTimestamp) {
        const object = Array.isArray(this.config.object) ? this.config.object[0] : this.config.object;
        const createdByAccountId = object.workflow.created_by_user_account;
        if (!createdByAccountId) { 
          // createdByAccountId does not exist
          return; 
        }
        this.userSubscription$ = this.restAPIConnector.getUserAccount(createdByAccountId).subscribe({
          next: (response) => {
            this.displayName = response.displayName;
          },
          complete: () => this.userSubscription$.unsubscribe(),
        });
      }
    }
    
    /**
     *get the formatted timestamp with relative date
     */
    public get humanized(): string {
        if (this._humanized) return this._humanized;
        else if (!this.config.object.hasOwnProperty(this.config.field)) this._humanized = "";
        else {
            let now = moment();
            let then = moment(this.config.object[this.config.field]);
            let difference = moment.duration(then.diff(now));
            if (difference.asWeeks() > -1) {
                // date is in last week, display humanized date
                this._humanized = difference.humanize(true); // show with suffix, eg "a week ago" instead of "a week"
            } else {
                // date is older, display absolute date
                this._humanized = then.format('D MMMM YYYY');
            }
        }
        return this._humanized;
    }

    /**
     *get the formatted absolute timestamp with hour/minute
     */
    public get timestamp(): string {
        if (!this.config.object.hasOwnProperty(this.config.field)) return "";
        return moment(this.config.object[this.config.field]).format('D MMMM YYYY, h:mm A')
    }
}
