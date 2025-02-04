import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Software } from 'src/app/classes/stix/software';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { StixViewPage } from '../../stix-view-page';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
    selector: 'app-software-view',
    templateUrl: './software-view.component.html',
    styleUrls: ['./software-view.component.scss']
})
export class SoftwareViewComponent extends StixViewPage implements OnInit {
    @Output() public onReload = new EventEmitter();
    public get software(): Software { return this.config.object as Software; }

    constructor(authenticationService: AuthenticationService, private restApiConnector: RestApiConnectorService) {
        super(authenticationService);
    }

    handleRelationshipChange() {
        console.log('A change in relationships has occurred.');
        let updatedSoftware: Software;
        updatedSoftware = this.software;
        updatedSoftware.workflow = {state: "work-in-progress"};
        let rep = updatedSoftware.serialize();
        rep.stix.modified = this.software.modified;
        // Emit the reload event
        this.updateSoftwareObject(this.software.stixID, this.software.modified.toISOString(), rep)
        this.onReload.emit();
        window.location.reload();
    }

    updateSoftwareObject(stixId: string, modified: string, updatedSoftware: Software) {
        this.restApiConnector.updateSoftware(stixId, modified, updatedSoftware).subscribe({
          next: (response) => {
            console.log('Software object updated successfully:', response);
          },
          error: (error) => {
            console.error('Error updating software object:', error);
          },
          complete: () => {
            console.log('Complete');
          }
        });
    }

    ngOnInit() {
        if (this.software.firstInitialized ) {
            this.software.initializeWithDefaultMarkingDefinitions(this.restApiConnector);
        }
    }

}
