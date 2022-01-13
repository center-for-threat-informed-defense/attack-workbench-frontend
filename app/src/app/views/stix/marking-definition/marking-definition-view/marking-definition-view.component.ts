import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MarkingDefinition } from 'src/app/classes/stix/marking-definition';
import { StixViewPage } from '../../stix-view-page';
import { MatDialog } from '@angular/material/dialog';
import { ValidationData } from 'src/app/classes/serializable';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-marking-definition-view',
    templateUrl: './marking-definition-view.component.html',
    styleUrls: ['./marking-definition-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MarkingDefinitionViewComponent extends StixViewPage implements OnInit {
    public get marking_definition(): MarkingDefinition { return this.config.object as MarkingDefinition; }
    public validating: boolean = false;
    public validationData: ValidationData = null;

    constructor(public dialog: MatDialog, private router: Router, private restApiConnector: RestApiConnectorService) { super(); }

    ngOnInit(): void {
    }

    /**
     * Enable save only during creation of marking definition
     */
    public get saveEnabled() {
        return this.validationData && this.validationData.errors.length == 0;
    }

    /**
     * Trigger marking definition validation and save behaviors
     *
     * @memberof MarkingDefinitionViewComponent
     */
    public validate() {
        this.validating = true;
        this.validationData = null;
        let subscription = this.marking_definition.validate(this.restApiConnector).subscribe({
            next: (results) => this.validationData = results,
            complete: () => subscription.unsubscribe()
        })
    }

    /**
     * Trigger save of marking definition after validation
     *
     */
    public save() {
        let subscription = this.marking_definition.save(this.restApiConnector).subscribe({
            next: (result) => {
                this.router.navigate([result.attackType, result.stixID]);
                this.validating = false;
            },
            complete: () => { subscription.unsubscribe(); }
        })
    }
}
