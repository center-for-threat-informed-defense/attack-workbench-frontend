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
	public get asset(): Asset { return this.configCurrentObject as Asset; }
	public get previous(): Asset { return this.configPreviousObject as Asset; }

	constructor(authenticationService: AuthenticationService, private restApiConnector: RestApiConnectorService) {
		super(authenticationService)
	}

	ngOnInit(): void {
		if (this.asset.firstInitialized) {
			this.asset.initializeWithDefaultMarkingDefinitions(this.restApiConnector);
		}
	}
}
