import { Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { EditorService } from 'src/app/services/editor/editor.service';
import { CitationPropertyConfig } from '../citation-property.component';
import { ExternalReferences } from 'src/app/classes/external-references';

@Component({
    selector: 'app-citation-edit',
    templateUrl: './citation-edit.component.html',
    styleUrls: ['./citation-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CitationEditComponent implements OnDestroy {
    @Input() public config: CitationPropertyConfig;
    private sub: Subscription = new Subscription(); // prevent async issues

    public get object() {
        return Array.isArray(this.config.object) ? this.config.object[0] : this.config.object;
    }

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
        let externalReferences: ExternalReferences = this.object[this.config.referencesField];
        this.sub = externalReferences.parseObjectCitations(this.object, this.restApiService).subscribe({
            complete: () => this.editorService.onReloadReferences.emit()
        })
    }
}
