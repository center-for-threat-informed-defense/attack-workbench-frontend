import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Technique } from 'src/app/classes/stix/technique';
import { StixViewPage } from '../../stix-view-page';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
    selector: 'app-technique-view',
    templateUrl: './technique-view.component.html',
    styleUrls: ['./technique-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TechniqueViewComponent extends StixViewPage implements OnInit, AfterContentChecked {
    @Output() public onReload = new EventEmitter();
    public get technique(): Technique { return this.configCurrentObject as Technique; }
    public get previous(): Technique | null { return this.configPreviousObject as Technique; }

    constructor(private ref: ChangeDetectorRef, authenticationService: AuthenticationService, private restApiConnector: RestApiConnectorService) {
        super(authenticationService);
    }

    ngOnInit() {
        if (this.technique.firstInitialized) {
            this.technique.initializeWithDefaultMarkingDefinitions(this.restApiConnector);
        }
    }

    ngAfterContentChecked() {
        this.ref.detectChanges();
    }

    public showCapecIdsField(): boolean {
        if (!this.config.mode || this.config.mode == 'view') return this.technique.capec_ids.length > 0;
        return this.technique.supportsCapecIds || this.previous?.supportsCapecIds;
    }

    public showMtcIdsField(): boolean {
        if (!this.config.mode || this.config.mode == 'view') return this.technique.mtc_ids.length > 0;
        return this.technique.supportsMtcIds || this.previous?.supportsMtcIds;
    }

    public showParentField(): boolean {
        if (!this.config.mode || this.config.mode == 'view') return false;
        return this.technique.is_subtechnique || this.previous?.is_subtechnique;
    }
}
