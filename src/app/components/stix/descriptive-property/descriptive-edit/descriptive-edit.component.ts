import {
  Component,
  Input,
  ViewEncapsulation,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { DescriptivePropertyConfig } from '../descriptive-property.component';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { DescriptiveViewComponent } from '../descriptive-view/descriptive-view.component';
import { Subscription } from 'rxjs';
import { EditorService } from 'src/app/services/editor/editor.service';

@Component({
  selector: 'app-descriptive-edit',
  templateUrl: './descriptive-edit.component.html',
  styleUrls: ['./descriptive-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class DescriptiveEditComponent implements OnDestroy {
  @Input() public config: DescriptivePropertyConfig;
  @ViewChild('description') public description: DescriptiveViewComponent;

  public parsingCitations = false;
  private sub: Subscription = new Subscription(); // prevent async issues
  private get parseReferences(): boolean {
    return this.config.parseReferences ?? true;
  }

  constructor(
    public restApiConnector: RestApiConnectorService,
    public editorService: EditorService
  ) {}

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
    if (!this.parseReferences) return;
    this.parsingCitations = true;
    this.sub = this.config.object[this.config.referencesField]
      .parseObjectCitations(this.config.object, this.restApiConnector)
      .subscribe({
        next: result => {
          this.parsingCitations = false;
          this.editorService.onReloadReferences.emit();
        },
      });
  }
}
