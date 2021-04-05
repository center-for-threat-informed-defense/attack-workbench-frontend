import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { Relationship } from 'src/app/classes/stix/relationship';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { EditorService } from 'src/app/services/editor/editor.service';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-object-status',
    templateUrl: './object-status.component.html',
    styleUrls: ['./object-status.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ObjectStatusComponent implements OnInit {

    public statusControl: FormControl;
    public select: SelectionModel<string>;
    public workflows: string[] = ["work-in-progress", "awaiting-review", "reviewed"];

    public objects: StixObject[];
    public object: StixObject;
    public relationships;
    public revoked: boolean = false;
    public deprecated: boolean = false;
    public workflow: string;

    constructor(private editorService: EditorService, private restAPIService: RestApiConnectorService, private dialog: MatDialog) { }

    ngOnInit(): void {
        this.statusControl = new FormControl();
        
        let data$: any;
        let options = {
            includeRevoked: true, 
            includeDeprecated: true
        }

        // retrieve object
        if (this.editorService.type == "software") data$ = this.restAPIService.getAllSoftware(options);
        else if (this.editorService.type == "group") data$ = this.restAPIService.getAllGroups(options);
        else if (this.editorService.type == "matrix") data$ = this.restAPIService.getAllMatrices(options);
        else if (this.editorService.type == "mitigation") data$ = this.restAPIService.getAllMitigations(options);
        else if (this.editorService.type == "tactic") data$ = this.restAPIService.getAllTactics(options);
        else if (this.editorService.type == "technique") data$ = this.restAPIService.getAllTechniques(options);
        let objSubscription = data$.subscribe({
            next: (data) => {
                this.objects = data.data;
                this.object = this.objects.find(object => object.stixID === this.editorService.stixId);
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

        if (event.checked) { // revoke object
            // prompt for revoking object
            this.select = new SelectionModel<string>(false);
            let revokedDialog = this.dialog.open(AddDialogComponent, {
                maxWidth: "70em",
                maxHeight: "70em",
                data: {
                    selectableObjects: this.objects.filter(object => { return object.stixID !== this.editorService.stixId}),
                    type: this.editorService.type,
                    select: this.select
                }
            });
            let revokedSubscription = revokedDialog.afterClosed().subscribe({
                next: (result) => {
                    console.log("result? ", result, "object: ", this.object.revoked)
                    if (result) { // object selected
                        let target_id = this.select.selected[0];
                        
                        // inform users of relationship changes
                        // TODO: bug - this isn't shown when un-deprecating relationships
                        // TODO: move to  undeprecate()?
                        let confirmationPrompt = this.dialog.open(ConfirmationDialogComponent, {
                            maxWidth: "35em",
                            data: { 
                                message: 'All relationships with this object will be ' + (event.checked ? 'deprecated' : 'undeprecated') + '. Do you want to continue?',
                            }
                        });

                        let confirmationSub = confirmationPrompt.afterClosed().subscribe({
                            next: (result) => {
                                if (result) {
                                    this.object.revoked = true;
                                    saves.push(this.object.save(this.restAPIService));
            
                                    // deprecate all relationships with this object
                                    saves = saves.concat(this.deprecateRelationships());
            
                                    // create a new 'revoked-by' relationship
                                    let revokedRelationship = new Relationship();
                                    revokedRelationship.relationship_type = "revoked-by";
                                    revokedRelationship.source_ref = this.object.stixID;
                                    revokedRelationship.target_ref = target_id;
            
                                    //TODO: suppress the snackbar indicating a relationship has been saved
                                    saves.push(revokedRelationship.save(this.restAPIService));
                                }
                            },
                            complete: () => { confirmationSub.unsubscribe(); }
                        });
                    }
                },
                complete: () => { revokedSubscription.unsubscribe(); }
            });
        } else { // unrevoke object
            //TODO: show confirmation prompt
            this.object.revoked = false;
            saves.push(this.object.save(this.restAPIService));
            saves = saves.concat(this.undeprecateRelationships());
        }

        // TODO: complete save calls
        // let saveSubscription = forkJoin(saves).subscribe({
        //     complete: () => {
        //         saveSubscription.unsubscribe(); 
        //     }
        // });
    }

    /**
     * Deprecates or undeprecates an object and its relationships
     * @param event deprecated selection
     */
    public deprecate(event) {
        let saves = [];

        // inform users of relationship changes
        let confirmationPrompt = this.dialog.open(ConfirmationDialogComponent, {
            maxWidth: "35em",
            data: { 
                message: 'All relationships with this object will be ' + (event.checked ? 'deprecated' : 'undeprecated') + '. Do you want to continue?',
            }
        });

        let confirmationSub = confirmationPrompt.afterClosed().subscribe({
            next: (result) => {
                if (result) {
                    // deprecate/undeprecate object
                    this.object.deprecated = event.checked;
                    saves.push(this.object.save(this.restAPIService));
            
                    // update relationships with the object
                    if (this.object.deprecated) saves = saves.concat(this.deprecateRelationships());
                    else saves = saves.concat(this.undeprecateRelationships());
            
                    // complete save calls
                    let saveSubscription = forkJoin(saves).subscribe({
                        complete: () => {
                            saveSubscription.unsubscribe(); 
                        }
                    });
                } // else user cancelled
            },
            complete: () => { confirmationSub.unsubscribe(); }
        })
    }

    /**
     * Check if the given object is deprecated or revoked
     * @param object source or target object of a relationship
     */
    private isDeprecatedOrRevoked(object: any) {
        return ('x_mitre_deprecated' in object && object.x_mitre_deprecated)
                || ('revoked' in object && object.revoked);
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

        //FIXME: relationships aren't being saved as deprecated
        for (let relationship of this.relationships) {
            if (!relationship.deprecated) {
                relationship.deprecated = true;
                saves.push(relationship.save(this.restAPIService));
            }
        }
        return saves;
    }
}
