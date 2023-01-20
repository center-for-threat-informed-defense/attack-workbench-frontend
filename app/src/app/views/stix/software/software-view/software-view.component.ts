import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Software } from 'src/app/classes/stix/software';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { StixViewPage } from '../../stix-view-page';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { EditorService } from 'src/app/services/editor/editor.service';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
    selector: 'app-software-view',
    templateUrl: './software-view.component.html',
    styleUrls: ['./software-view.component.scss']
})
export class SoftwareViewComponent extends StixViewPage implements OnInit {
    @Output() public onReload = new EventEmitter();
    public get software(): Software { return this.config.object as Software; }

    constructor(authenticationService: AuthenticationService,
                private restApiConnector: RestApiConnectorService,
                private editorService: EditorService) {
        super(authenticationService);
    }

    ngOnInit() {
        if (this.software.firstInitialized ) {
            this.software.initializeWithDefaultMarkingDefinitions(this.restApiConnector);
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
