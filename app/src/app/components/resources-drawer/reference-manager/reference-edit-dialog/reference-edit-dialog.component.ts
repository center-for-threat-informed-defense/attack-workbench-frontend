import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExternalReference } from 'src/app/classes/external-references';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-reference-edit-dialog',
  templateUrl: './reference-edit-dialog.component.html',
  styleUrls: ['./reference-edit-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReferenceEditDialogComponent implements OnInit {
    public reference: ExternalReference;
    public is_new: boolean;
    constructor(public dialogRef: MatDialogRef<ReferenceEditDialogComponent>, @Inject(MAT_DIALOG_DATA) public config: ReferenceEditConfig, public restApiConnectorService: RestApiConnectorService) {
        if (this.config.reference) {
            this.is_new = false;
            this.reference = JSON.parse(JSON.stringify(this.config.reference)); //deep copy
        }
        else {
            this.is_new = true;
            this.reference = {
                source_name: "",
                url: "",
                description: ""
            }
        }
    }

    ngOnInit(): void {
    } 

    public save() {
        let api = this.is_new? this.restApiConnectorService.postReference(this.reference) : this.restApiConnectorService.putReference(this.reference);
        let subscription = api.subscribe({
            complete: () => { 
                subscription.unsubscribe();
                this.dialogRef.close();
            }
        });
    }

}

export interface ReferenceEditConfig {
    reference?: ExternalReference
}