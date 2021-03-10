import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ExternalReference } from 'src/app/classes/external-references';
import { Paginated, RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-reference-manager',
  templateUrl: './reference-manager.component.html',
  styleUrls: ['./reference-manager.component.scss']
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

    
    constructor(private restApiConnector: RestApiConnectorService) { }
    
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
