import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Technique } from 'src/app/classes/stix/technique';
import { StixViewPage } from '../../stix-view-page';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { EditorService } from 'src/app/services/editor/editor.service';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
    selector: 'app-technique-view',
    templateUrl: './technique-view.component.html',
    styleUrls: ['./technique-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TechniqueViewComponent extends StixViewPage implements OnInit, AfterContentChecked {
    @Output() public onReload = new EventEmitter();
    public get technique(): Technique { return this.config.object as Technique; }

    constructor(private ref: ChangeDetectorRef,
                authenticationService: AuthenticationService,
                private restApiConnector: RestApiConnectorService,
                private editorService: EditorService) {
        super(authenticationService);
    }

    ngOnInit() {
        if (this.technique.firstInitialized) {
            this.technique.initializeWithDefaultMarkingDefinitions(this.restApiConnector);
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

    ngAfterContentChecked() {
        this.ref.detectChanges();
    }

    /**
     * Get label for the data sources field.
     * Appends 'ics' for clarification if the object is cross-domain
     */
    public dataSourcesLabel(): string {
        let label = 'data sources';
        if (this.technique.domains.includes('ics-attack') && this.technique.domains.length > 1) {
            label = 'ics ' + label;
        }
        return label;
    }

    public showDomainField(domain: string, field: string): boolean {
        return this.technique.domains.includes(domain) && (this.technique[field].length > 0 || this.editing);
    }

    public showTacticField(tactic: string, field: string): boolean {
        return this.technique.tactics.includes(tactic) && (this.technique[field].length > 0 || this.editing);
    }
}
