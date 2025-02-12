import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Asset } from 'src/app/classes/stix';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixViewPage } from '../../stix-view-page';

@Component({
	selector: 'app-asset-view',
	templateUrl: './asset-view.component.html'
})
export class AssetViewComponent extends StixViewPage implements OnInit {
	@Output() public onReload = new EventEmitter();
	public get asset(): Asset { return this.config.object as Asset; }

	constructor(authenticationService: AuthenticationService, restApiConnector: RestApiConnectorService) {
		super(authenticationService, restApiConnector)
	}

	ngOnInit(): void {
		if (this.asset.firstInitialized) {
			this.asset.initializeWithDefaultMarkingDefinitions(this.restApiConnector);
		}
	}
}
