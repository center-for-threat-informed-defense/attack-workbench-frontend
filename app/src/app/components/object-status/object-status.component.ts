import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Relationship } from 'src/app/classes/stix/relationship';
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
    public relationships;
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
        let objSubscription = data$.subscribe({
            next: (data) => {
                this.object = data[0];
                if (this.object.workflow && this.object.workflow.state) {
                    this.statusControl.setValue(this.object.workflow.state);
                    this.workflow = this.object.workflow.state;
                }
                this.revoked = this.object.revoked;
                this.deprecated = this.object.deprecated;
            },
            complete: () => { objSubscription.unsubscribe() }
        });

        // retrieve relationships with the object
        data$ = this.restAPIService.getRelatedTo({sourceOrTargetRef: this.editorService.stixId});
        let relSubscription = data$.subscribe({
            next: (data) => { this.relationships = data.data; },
            complete: () => { relSubscription.unsubscribe() }
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
        let saves = [];

        this.object.revoked = event.checked;
        saves.push(this.object.save(this.restAPIService));

        if (this.object.revoked) {
            // TODO: get revoking object

            // deprecate all relationships with this object
            saves = saves.concat(this.deprecateRelationships());

            // create a new 'revoked-by' relationship
            let revokedRelationship = new Relationship();
            revokedRelationship.relationship_type = "revoked-by";
            revokedRelationship.source_ref = this.object.stixID;
            revokedRelationship.target_ref; //TODO

            saves.push(revokedRelationship.save(this.restAPIService));

        } else {
            saves = saves.concat(this.undeprecateRelationships());
        }

        // TODO: complete save calls
        // let subscription = forkJoin(saves).subscribe({
        //     complete: () => {
        //         subscription.unsubscribe(); 
        //     }
        // })
    }

    public deprecate(event) {
        let saves = [];

        this.object.deprecated = event.checked;
        saves.push(this.object.save(this.restAPIService));

        if (this.object.deprecated) saves = saves.concat(this.deprecateRelationships());
        else saves = saves.concat(this.undeprecateRelationships());

        // TODO: complete save calls
        // let subscription = forkJoin(saves).subscribe({
        //     complete: () => {
        //         subscription.unsubscribe(); 
        //     }
        // })
    }

    /**
     * Check if the given object is deprecated or revoked
     * @param object source or target object of a relationship
     */
    private isDeprecatedOrRevoked(object: any) {
        return ('x_mitre_deprecated' in object && object.x_mitre_deprecated)
                || ('x_mitre_revoked' in object && object.x_mitre.revoked);
    }

    /**
     * Undeprecates all relationships of this object, 
     * unless the other relationship object has been revoked or deprecated
     */
    private undeprecateRelationships() {
        let saves = [];
        for (let relationship of this.relationships) {
            if (relationship.deprecated) {
                let other_obj: any;
                if (relationship.source_object.stix.id == this.object.stixID) other_obj = relationship.target_object.stix;
                else other_obj = relationship.source_object.stix;

                // un-deprecate relationship if the other object has not been revoked/deprecated
                if (!this.isDeprecatedOrRevoked(other_obj)) {
                    relationship.deprecated = false;
                    saves.push(relationship.save(this.restAPIService));
                }
            }
        }
        return saves;
    }

    /**
     * Deprecates all relationships of this object
     */
    private deprecateRelationships() {
        let saves = [];

        // TODO: inform user that all relationships will be deprecated
        for (let relationship of this.relationships) {
            if (!relationship.deprecated) {
                relationship.deprecated = true;
                saves.push(relationship.save(this.restAPIService));
            }
        }
        return saves;
    }
}
