import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ExternalReference,
  ExternalReferences,
} from 'src/app/classes/external-references';
import { EditorService } from 'src/app/services/editor/editor.service';
import { ExternalReferencesPropertyConfig } from '../external-references-property.component';

@Component({
  selector: 'app-external-references-view',
  templateUrl: './external-references-view.component.html',
  styleUrls: ['./external-references-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ExternalReferencesViewComponent implements OnInit, OnDestroy {
  @Input() public config: ExternalReferencesPropertyConfig;
  public onEditStopSubscription: Subscription;
  public onReloadReferencesSub: Subscription;
  public referenceList: [number, ExternalReference, string][] = [];

  public get object() {
    return Array.isArray(this.config.object)
      ? this.config.object[0]
      : this.config.object;
  }

  constructor(private editorService: EditorService) {
    this.onEditStopSubscription = this.editorService.onEditingStopped.subscribe(
      {
        next: () => {
          this.loadReferences();
        }, // reload references when done editing
      }
    );
    this.onReloadReferencesSub =
      this.editorService.onReloadReferences.subscribe({
        next: () => {
          this.loadReferences();
        }, // reload references on text preview
      });
  }

  ngOnInit(): void {
    this.loadReferences();
  }

  ngOnDestroy(): void {
    this.onEditStopSubscription.unsubscribe();
    this.onReloadReferencesSub.unsubscribe();
  }

  public loadReferences(): void {
    const objReferences: ExternalReferences =
      this.object[this.config.referencesField];
    this.referenceList = objReferences.list();
  }
}
