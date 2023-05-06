import { Component, OnInit } from '@angular/core';
import { Matrix } from 'src/app/classes/stix/matrix';
import { StixViewPage } from '../../stix-view-page';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { EditorService } from 'src/app/services/editor/editor.service';

@Component({
    selector: 'app-matrix-view',
    templateUrl: './matrix-view.component.html',
    styleUrls: ['./matrix-view.component.scss']
})
export class MatrixViewComponent extends StixViewPage implements OnInit {
    public all_tactics: Array<StixObject>;

    public get matrix(): Matrix { return this.config.object as Matrix; }

    constructor(private restAPIConnectorService: RestApiConnectorService,
                authenticationService: AuthenticationService,
                private editorService: EditorService) {
        super(authenticationService);
    }

    ngOnInit() {
        if (!this.config.hasOwnProperty('showRelationships') || this.config.showRelationships) {
            let subscription = this.restAPIConnectorService.getAllTactics().subscribe({
                next: (all_tactics) => {
                    this.all_tactics = all_tactics.data;
                },
                complete: () => { subscription.unsubscribe(); } //prevent memory leaks
            });
        }
        if (this.matrix.firstInitialized) {
            this.matrix.initializeWithDefaultMarkingDefinitions(this.restAPIConnectorService);
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
}
