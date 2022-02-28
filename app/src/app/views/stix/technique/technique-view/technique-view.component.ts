import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Technique } from 'src/app/classes/stix/technique';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { StixViewPage } from '../../stix-view-page';
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";

@Component({
    selector: 'app-technique-view',
    templateUrl: './technique-view.component.html',
    styleUrls: ['./technique-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TechniqueViewComponent extends StixViewPage implements OnInit, AfterContentChecked {
    public get technique(): Technique { return this.config.object as Technique; }

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
