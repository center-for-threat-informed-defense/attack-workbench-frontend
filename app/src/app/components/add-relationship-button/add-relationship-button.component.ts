import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EMPTY } from 'rxjs';
import { Relationship } from 'src/app/classes/stix/relationship';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixDialogComponent } from 'src/app/views/stix/stix-dialog/stix-dialog.component';
import { StixViewConfig } from 'src/app/views/stix/stix-view-page';

@Component({
  selector: 'app-add-relationship-button',
  templateUrl: './add-relationship-button.component.html',
  styleUrls: ['./add-relationship-button.component.scss']
})
export class AddRelationshipButtonComponent implements OnInit {
    @Input() config: AddRelationshipButtonConfig;
    @Output() created = new EventEmitter();
    public loading: boolean = false; // is the component currently loading/creating the relationship?
    constructor(public restApiService: RestApiConnectorService, public dialog: MatDialog) { }

    ngOnInit(): void {
    }

    public createRelationship() {
        let relationship = new Relationship();
        relationship.relationship_type = this.config.relationship_type;
        let initializer = null;
        if (this.config.source_object) initializer = relationship.set_source_object(this.config.source_object, this.restApiService);
        else if (this.config.source_ref) initializer = relationship.set_source_ref(this.config.source_ref, this.restApiService);
        else if (this.config.target_object) initializer = relationship.set_target_object(this.config.target_object, this.restApiService);
        else if (this.config.target_ref) initializer = relationship.set_target_ref(this.config.target_ref, this.restApiService);
        else initializer = EMPTY;
        this.loading = true;
        var zip_subscription = initializer.subscribe({
            next: () => {
                this.loading = false;
                let config: StixViewConfig = {
                    object: relationship,
                    editable: true,
                    mode: "edit",
                    sidebarControl: "events"
                }

                // if a dialog reference is provided, replace the active
                // content with the relationship edit interface. This prevents
                // a new dialog from opening over the current dialog.
                if (this.config.dialog && this.config.dialog.componentInstance) {
                    this.config.dialog.componentInstance._config = config;
                    this.config.dialog.componentInstance.prevObject = this.config.source_object ? this.config.source_object : this.config.target_object;
                    this.config.dialog.componentInstance.startEditing();
                    return;
                }

                // open a new dialog
                let prompt = this.dialog.open(StixDialogComponent, {
                    data: config,
                    maxHeight: "75vh"
                })
                let subscription = prompt.afterClosed().subscribe({
                    next: result => { if (prompt.componentInstance.dirty) this.created.emit(); }, //re-fetch values since an edit occurred
                    complete: () => { subscription.unsubscribe(); }
                });
            },
            complete: () => { if (zip_subscription) zip_subscription.unsubscribe(); } //for some reason zip_subscription doesn't exist if using set_source_object or set_target_object
        })
    }
}

export interface AddRelationshipButtonConfig {
    // text label to be shown on the button
    label: string;
    relationship_type: string; //relationship type to create
    source_ref?: string; //initial relationship source ref.
    source_object?: StixObject; //initial relationship source object. Takes precedence over source_ref if both are specified, and is much faster to execute
    target_ref?: string; //initial relationship target ref
    target_object?: StixObject; //initial relationship target object. Takes precedence over target_ref if both are specified, and is much faster to execute
    /**
     * reference to the current working dialog. This is relevant when adding a new relationship from within the dialog.
     * If provided, the 'create relationship' interface will replace the dialog content.
     */
    dialog?: MatDialogRef<StixDialogComponent>
}