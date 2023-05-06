import { Component, OnInit } from '@angular/core';
import { Tactic } from 'src/app/classes/stix/tactic';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { StixViewPage } from '../../stix-view-page';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { EditorService } from 'src/app/services/editor/editor.service';

@Component({
    selector: 'app-tactic-view',
    templateUrl: './tactic-view.component.html',
    styleUrls: ['./tactic-view.component.scss']
})
export class TacticViewComponent extends StixViewPage implements OnInit {
    public loading: boolean = false;
    public get tactic(): Tactic { return this.config.object as Tactic; }
    public techniques: StixObject[] = [];

    constructor(authenticationService: AuthenticationService,
                private restApiConnector: RestApiConnectorService,
                private editorService: EditorService) {
        super(authenticationService);
    }

    ngOnInit() {
        if (this.tactic.firstInitialized) {
            this.tactic.initializeWithDefaultMarkingDefinitions(this.restApiConnector);
        } else {
            this.getTechniques();
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

    /**
     * Get techniques under this tactic
     */
    public getTechniques(): void {
        this.loading = true;
        let data$: any = this.restApiConnector.getTechniquesInTactic(this.tactic.stixID, this.tactic.modified);
        let subscription = data$.subscribe({
            next: (result) => {
                this.techniques = result;
                this.loading = false;
            },
            complete: () => { subscription.unsubscribe() }
        })
    }
}
