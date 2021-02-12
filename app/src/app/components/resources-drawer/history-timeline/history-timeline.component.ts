import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-history-timeline',
  templateUrl: './history-timeline.component.html',
  styleUrls: ['./history-timeline.component.scss']
})
export class HistoryTimelineComponent implements OnInit {

    public historyEvents: StixObject[];
    public loading: boolean = false;
    @Output() public historyLoaded = new EventEmitter();

    constructor(private route: ActivatedRoute, 
                private router: Router, 
                private restAPIConnectorService: RestApiConnectorService) { }

    ngOnInit(): void {
        this.loading = true;
        let objectType = this.router.url.split("/")[1];
        let objectStixID = this.router.url.split("/")[2];
        // set up subscribers to get object versions
        let objects$;
        if (objectType == "software") objects$ = this.restAPIConnectorService.getSoftware(objectStixID, null, "all");
        else if (objectType == "group") objects$ = this.restAPIConnectorService.getGroup(objectStixID, null, "all");
        else if (objectType == "matrix") objects$ = this.restAPIConnectorService.getMatrix(objectStixID, null, "all");
        else if (objectType == "mitigation") objects$ = this.restAPIConnectorService.getMitigation(objectStixID, null, "all");
        else if (objectType == "tactic") objects$ = this.restAPIConnectorService.getTactic(objectStixID, null, "all");
        else if (objectType == "technique") objects$ = this.restAPIConnectorService.getTechnique(objectStixID, null, "all");
        else if (objectType == "collection") objects$ = this.restAPIConnectorService.getCollection(objectStixID, null, "all");
        // set up subscribers to get relationships
        let relationshipsTo$ = this.restAPIConnectorService.getRelatedTo(null, objectStixID);
        let relationshipsFrom$ = this.restAPIConnectorService.getRelatedTo(objectStixID, null);
        // join subscribers
        let subscription = forkJoin({
            objectVersions: objects$,
            relationshipsTo: relationshipsTo$,
            relationshipsFrom: relationshipsFrom$
        }).subscribe({
            next: (result) => {
                let versions = []
                versions = versions.concat(result.objectVersions);
                versions = versions.concat(result.relationshipsTo.data);
                versions = versions.concat(result.relationshipsFrom.data);
                this.historyEvents = versions.sort((a,b) => (b.modified as any) - (a.modified as any));
                this.loading = false;
                console.log(this.historyEvents);
                // this.historyLoaded.emit()
                setTimeout(() => this.historyLoaded.emit()); //resize drawers after a render cycle
            },
            complete: () => { subscription.unsubscribe() }
        });
    }

}
