import { Component, OnInit } from '@angular/core';
import { DataSource } from 'src/app/classes/stix/data-source';
import { DataComponent } from 'src/app/classes/stix/data-component';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixViewPage } from '../../stix-view-page';
import { MatDialog } from '@angular/material/dialog';
import { StixDialogComponent } from '../../stix-dialog/stix-dialog.component';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { EditorService } from 'src/app/services/editor/editor.service';

@Component({
    selector: 'app-data-source-view',
    templateUrl: './data-source-view.component.html',
    styleUrls: ['./data-source-view.component.scss']
})
export class DataSourceViewComponent extends StixViewPage implements OnInit {
    public get data_source(): DataSource {
        return this.config.object as DataSource;
    }

    public data_components: DataComponent[] = [];
    public loading = false;

    constructor(public dialog: MatDialog,
                private restAPIConnectorService: RestApiConnectorService,
                authenticationService: AuthenticationService,
                private editorService: EditorService)
    {
      super(authenticationService);
    }

    ngOnInit(): void {
        this.data_components = this.data_source.data_components;
        let data_source = this.config.object as DataSource;
        if ( data_source.firstInitialized ) {
            data_source.initializeWithDefaultMarkingDefinitions(this.restAPIConnectorService);
        }
        /**
         * Whenever the view is initialized, the `revoked` property on EditorService must be updated to match the
         * `revoked` property of whichever STIX object is currently in view. When EditorService receives this update, it
         * notifies ToolbarComponent which happens to be subscribed to the revoked$ Subject (a type of Observable) in
         * EditorService. ToolbarComponent thus sets its copy of `revoked` to the same value of `revoked` from the
         * aforementioned STIX object. ToolbarComponent has a boolean property, `editable` that can only be true if
         * `revoked` is false.
         *
         * TL;DR the following call to editorService.updateRevoked is necessary to ensure that the edit toolbar is not
         * shown when the object in view is revoked.
         */
        this.editorService.updateRevoked((this.config.object as StixObject).revoked);
    }

    public getDataComponents(): void {
        this.loading = true;
        let data$ = this.restAPIConnectorService.getAllDataComponents();
        let sub = data$.subscribe({
            next: (results) => {
                let objects = results.data as DataComponent[];
                this.data_components = objects.filter(obj => obj.data_source_ref == this.data_source.stixID)
                this.loading = false;
            },
            complete: () => {sub.unsubscribe();}
        })
    }

    public createDataComponent(): void {
        let data_component = new DataComponent();
        data_component.data_source_ref = this.data_source.stixID;
        data_component.data_source = this.data_source;
        data_component.workflow = undefined;
        let prompt = this.dialog.open(StixDialogComponent, {
            data: {
                object: data_component,
                editable: true,
                mode: "edit",
                is_new: true,
                sidebarControl: "events"
            },
            maxHeight: "75vh"
        });
        let subscription = prompt.afterClosed().subscribe({
            next: (result) => {
                if (result) { this.getDataComponents(); } //re-fetch values since an edit occurred
            },
            complete: () => { subscription.unsubscribe(); }
        });
    }
}
