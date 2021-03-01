import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Relationship } from 'src/app/classes/stix/relationship';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixDialogComponent } from 'src/app/views/stix/stix-dialog/stix-dialog.component';

@Component({
  selector: 'app-add-relationship-button',
  templateUrl: './add-relationship-button.component.html',
  styleUrls: ['./add-relationship-button.component.scss']
})
export class AddRelationshipButtonComponent implements OnInit {
    @Input() config: AddRelationshipButtonConfig;
    @Output() created = new EventEmitter();
    
    constructor(public restApiService: RestApiConnectorService, public dialog: MatDialog) { }

    ngOnInit(): void {
    }

    public createRelationship() {
        let relationship = new Relationship();
        relationship.relationship_type = this.config.relationship_type;
        if (this.config.source_ref) relationship.set_source_ref(this.config.source_ref, this.restApiService);
        if (this.config.source_ref) relationship.set_target_ref(this.config.target_ref, this.restApiService);
        let prompt = this.dialog.open(StixDialogComponent, {
            data: {
                object: relationship,
                editable: true,
                mode: "edit",
                sidebarControl: "events"
            },
            maxHeight: "75vh"
        })
        let subscription = prompt.afterClosed().subscribe({
            next: result => { if (prompt.componentInstance.dirty) this.created.emit(); }, //re-fetch values since an edit occurred
            complete: () => { subscription.unsubscribe(); }
        });
    }

}

export interface AddRelationshipButtonConfig {
    // text label to be shown on the button
    label: string;
    relationship_type: string; //relationship type to create
    source_ref?: string; //initial relationship source ref
    target_ref?: string; //initial relationship target ref
}