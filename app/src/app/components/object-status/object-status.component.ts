import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { EditorService } from 'src/app/services/editor/editor.service';

@Component({
    selector: 'app-object-status',
    templateUrl: './object-status.component.html',
    styleUrls: ['./object-status.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ObjectStatusComponent implements OnInit {

    public statusControl: FormControl;
    public workflows: string[] = ["work-in-progress", "awaiting-review", "reviewed"];

    public object: StixObject;
    public revoked: boolean = false;
    public deprecated: boolean = false;
    public workflow: string;

    constructor(private editorService: EditorService, private restAPIService: RestApiConnectorService) { }

    ngOnInit(): void {
        this.statusControl = new FormControl();
        
        // retrieve the object
        let data$: any;
        if (this.editorService.type == "software") data$ = this.restAPIService.getSoftware(this.editorService.stixId);
        else if (this.editorService.type == "group") data$ = this.restAPIService.getGroup(this.editorService.stixId);
        else if (this.editorService.type == "matrix") data$ = this.restAPIService.getMatrix(this.editorService.stixId);
        else if (this.editorService.type == "mitigation") data$ = this.restAPIService.getMitigation(this.editorService.stixId);
        else if (this.editorService.type == "tactic") data$ = this.restAPIService.getTactic(this.editorService.stixId);
        else if (this.editorService.type == "technique") data$ = this.restAPIService.getTechnique(this.editorService.stixId);
        let subscription = data$.subscribe({
            next: (data) => {
                this.object = data[0];
                if (this.object.workflow && this.object.workflow.state) {
                    this.statusControl.setValue(this.object.workflow.state);
                    this.workflow = this.object.workflow.state;
                }
                this.revoked = this.object.revoked;
                this.deprecated = this.object.deprecated;
            },
            complete: () => { subscription.unsubscribe() }
        });
    }

    /**
     * Handle workflow state change
     * @param event workflow state selection
     */
    public workflowChange(event) {
        if (event.isUserInput) {
            this.object.workflow = {state: event.source.value};
            this.object.save(this.restAPIService);
        }
    }

    /**
     * 
     * @param event 
     */
    public revoke(event) {
    }

    public deprecate(event) {
    }
}
