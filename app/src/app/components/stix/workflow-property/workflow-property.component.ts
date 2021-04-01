import { Component, Input, OnInit } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
    selector: 'app-workflow-property',
    templateUrl: './workflow-property.component.html',
    styleUrls: ['./workflow-property.component.scss']
})
export class WorkflowPropertyComponent implements OnInit {
    @Input() public config: WorkflowPropertyConfig;
    
    public icon: string;
    public color: string;

    constructor() { }

    ngOnInit(): void {
        let workflow = this.config.object['workflow'] ? this.config.object['workflow'] : null;
        let state = workflow ? workflow[this.config.field] : null;

        switch (state) {
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
    }

}

export interface WorkflowPropertyConfig {
    /* The object to show the workflow field of
     * Note: if mode is diff, pass an array of two objects to diff
     */
    object: StixObject | [StixObject, StixObject];

    /** field; field of the object workflow to be displayed */
    field: string;
  }
  