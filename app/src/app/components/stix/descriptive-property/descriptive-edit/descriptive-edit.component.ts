import { Component, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { DescriptivePropertyConfig } from '../descriptive-property.component';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { DescriptiveViewComponent } from '../descriptive-view/descriptive-view.component';
import { Subscription } from 'rxjs';
import { EditorService } from 'src/app/services/editor/editor.service';

@Component({
    selector: 'app-descriptive-edit',
    templateUrl: './descriptive-edit.component.html',
    styleUrls: ['./descriptive-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class DescriptiveEditComponent {
    @Input() public config: DescriptivePropertyConfig;
    @ViewChild('description') public description: DescriptiveViewComponent;
    public parsingCitations: boolean = false;
    private sub: Subscription = new Subscription(); // prevent async issues

    constructor(public restApiConnector: RestApiConnectorService, public editorService: EditorService) { }

    /**
     * Handle tab selection change to render preview in "Preview" tab
     * @param {MatTabChangeEvent} $event tab change event
     */
    public selectionChanged($event): void {
        if ($event && $event.index == 1) {
            this.description.renderPreview();
        }
    }

    /**
     * Parse external reference citations
     */
    public parseCitations(): void {
        this.parsingCitations = true;
        this.sub = this.config.object['external_references'].parseCitations(this.config.object[this.config.field], this.restApiConnector).subscribe({
            next: (result) => {
                this.parsingCitations = false;
                this.editorService.onReloadReferences.emit();
            },
            complete: () => { if (this.sub) this.sub.unsubscribe(); }
        })
    }
}
