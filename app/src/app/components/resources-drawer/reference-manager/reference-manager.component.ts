import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ExternalReference } from 'src/app/classes/external-references';
import { Paginated, RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { ReferenceEditDialogComponent } from './reference-edit-dialog/reference-edit-dialog.component';

@Component({
  selector: 'app-reference-manager',
  templateUrl: './reference-manager.component.html',
  styleUrls: ['./reference-manager.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReferenceManagerComponent implements OnInit {
    public newRef: ExternalReference = {
        source_name: "",
        description: "",
        url: ""
    }
    public search_source_ref = "";
    public search_result: ExternalReference = null;

    public references$: Observable<Paginated<ExternalReference>>;

    
    constructor(private restApiConnector: RestApiConnectorService, public snackbar: MatSnackBar, public dialog: MatDialog) { }
    
    public createReference() {
        let subscription = this.restApiConnector.postReference(this.newRef).subscribe({
            next: (result) => {
                this.newRef = {
                    source_name: "",
                    description: "",
                    url: ""
                }
                this.refreshReferences();
            },
            complete: () => { subscription.unsubscribe(); }
        })
    }

    public editReference(reference?: ExternalReference) {
        this.dialog.open(ReferenceEditDialogComponent, {
            maxHeight: "75vh",
            data: {
                reference: reference
            }
        })
    }

    /**
     * Given a source_name, get the citation text
     * @param {*} source_name the source_name of the reference
     * @returns the citation text
     */
    public getCitation(source_name) {
        return `(Citation: ${source_name})`
    }

    public refreshReferences() {
        this.references$ = this.restApiConnector.getAllReferences();
    }

    public search() {
        let subscription = this.restApiConnector.getReference(this.search_source_ref).subscribe({
            next: (result) => { this.search_result = result; },
            complete: () => { subscription.unsubscribe(); }
        })
    }

    ngOnInit(): void {
        this.refreshReferences();
    }

}
