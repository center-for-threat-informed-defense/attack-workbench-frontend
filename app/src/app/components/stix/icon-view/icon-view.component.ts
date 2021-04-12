import { Component, Input, OnInit } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
    selector: 'app-icon-view',
    templateUrl: './icon-view.component.html',
    styleUrls: ['./icon-view.component.scss']
})
export class IconViewComponent implements OnInit {
    @Input() public config: IconViewConfig;
    
    public icon: string;
    public color: string;
    public state: string;

    constructor() { }

    ngOnInit(): void {
        if (this.config.field == "workflow") {
            let workflow = this.config.object['workflow'] ? this.config.object['workflow'] : null;
            this.state = workflow ? workflow['state'] : null;

            switch (this.state) {
                case "work-in-progress":
                    this.icon = "assignment";
                    this.color = "error";
                    break;
                case "awaiting-review":
                    this.icon = "assignment_ind";
                    this.color = "warn";
                    break;
                case "reviewed":
                    this.icon = "assignment_turned_in";
                    this.color = "success";
                    break;
                default:
                    break;
            }
        } else if (this.config.field == "state") {
            if (this.config.object['revoked'] || this.config.object['deprecated']) {
                this.icon = "warning";
                this.color = "error";
            }

            if (this.config.object['revoked']) this.state = "revoked";
            else if (this.config.object['deprecated']) this.state = "deprecated";
        }
    }
}

export interface IconViewConfig {
    /* The object of which to show the field */
    object: StixObject | [StixObject, StixObject];

    /** field; field of the object workflow to be displayed */
    field: string;
  }
  