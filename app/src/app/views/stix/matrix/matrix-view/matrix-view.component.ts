import { Component, OnInit } from '@angular/core';
import { Matrix } from 'src/app/classes/stix/matrix';
import { StixViewPage } from '../../stix-view-page';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { ViewModel, ViewModelsService } from 'src/app/services/viewmodels.service';

@Component({
    selector: 'app-matrix-view',
    templateUrl: './matrix-view.component.html',
    styleUrls: ['./matrix-view.component.scss']
})
export class MatrixViewComponent extends StixViewPage implements OnInit {
    public all_tactics: Array<StixObject>;

    public get matrix(): Matrix { return this.config.object as Matrix; }
    viewModel: ViewModel = null;
    constructor(private restAPIConnectorService: RestApiConnectorService, authenticationService: AuthenticationService, public viewModelsService: ViewModelsService) {
        super(authenticationService);
    }

    ngOnInit() {
        if (!this.config.hasOwnProperty('showRelationships') || this.config.showRelationships) {
            let subscription = this.restAPIConnectorService.getAllTactics().subscribe({
                next: (all_tactics) => {
                    this.all_tactics = all_tactics.data;
                },
                complete: () => { subscription.unsubscribe(); } //prevent memory leaks
            })
        }
        if (this.matrix.firstInitialized) {
            this.matrix.initializeWithDefaultMarkingDefinitions(this.restAPIConnectorService);
        }
        let vm = this.viewModelsService.newViewModel("newMatrixView");
        vm.loadVMData();
        this.viewModel = vm;
    }
}
