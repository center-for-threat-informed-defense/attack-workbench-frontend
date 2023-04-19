import { Component, Input, ViewEncapsulation, ViewChild, OnDestroy, OnInit } from '@angular/core';
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

export class DescriptiveEditComponent implements OnDestroy, OnInit {
    @Input() public config: DescriptivePropertyConfig;
    @ViewChild('description') public description: DescriptiveViewComponent;
    public parsingCitations: boolean = false;
    private sub: Subscription = new Subscription(); // prevent async issues
    private parseReferences: boolean = true;

    constructor(public restApiConnector: RestApiConnectorService, public editorService: EditorService) { }

    ngOnInit(): void {
      if (this.config && 'parseReferences' in this.config) {
        this.parseReferences = this.config.parseReferences;
      }
    }

    ngOnDestroy(): void {
        if (this.sub) this.sub.unsubscribe();
    }

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
        if (this.parseReferences) {
          this.parsingCitations = true;
          this.sub = this.config.object['external_references'].parseObjectCitations(this.config.object, this.restApiConnector).subscribe({
              next: (result) => {
                  this.parsingCitations = false;
                  this.editorService.onReloadReferences.emit();
              }
          })
        }
    }
}
