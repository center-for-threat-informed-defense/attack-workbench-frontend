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

    constructor(private editorService: EditorService, private restAPIService: RestApiConnectorService) { }

    ngOnInit(): void {
        this.statusControl = new FormControl();
        
        let data$: any;
        if (this.editorService.type == "software") data$ = this.restAPIService.getSoftware(this.editorService.stixId);
        else if (this.editorService.type == "group") data$ = this.restAPIService.getGroup(this.editorService.stixId);
        else if (this.editorService.type == "matrix") data$ = this.restAPIService.getMatrix(this.editorService.stixId);
        else if (this.editorService.type == "mitigation") data$ = this.restAPIService.getMitigation(this.editorService.stixId);
        else if (this.editorService.type == "tactic") data$ = this.restAPIService.getTactic(this.editorService.stixId);
        else if (this.editorService.type == "technique") data$ = this.restAPIService.getTechnique(this.editorService.stixId);
        let subscription = data$.subscribe({
            next: (data) => {
                let object = data as StixObject;
                if (object.workflow && object.workflow.state) {
                    this.statusControl.setValue(object.workflow.state)
                }
            },
            complete: () => { subscription.unsubscribe() }
        });
    }
}
