import { Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { EditorService } from 'src/app/services/editor/editor.service';
import { CitationPropertyConfig } from '../citation-property.component';

@Component({
    selector: 'app-citation-edit',
    templateUrl: './citation-edit.component.html',
    styleUrls: ['./citation-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CitationEditComponent implements OnDestroy {
    @Input() public config: CitationPropertyConfig;
    private sub: Subscription = new Subscription(); // prevent async issues

    constructor(public restApiService: RestApiConnectorService, public editorService: EditorService) {
        // intentionally left blank
    }

    ngOnDestroy(): void {
        if (this.sub) this.sub.unsubscribe();
    }

    /**
     * On input blur, parse citations into the external references field
     */
    public parseCitations(): void {
        this.sub = this.config.object['external_references'].parseObjectCitations(this.config.object, this.restApiService).subscribe({
            complete: () => this.editorService.onReloadReferences.emit()
        })
    }
}
