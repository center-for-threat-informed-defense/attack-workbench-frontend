import { Component, OnInit, Input, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExternalReference } from 'src/app/classes/external-references';
import { EditorService } from 'src/app/services/editor/editor.service';
import { ExternalReferencesPropertyConfig } from '../external-references-property.component';

@Component({
    selector: 'app-external-references-view',
    templateUrl: './external-references-view.component.html',
    styleUrls: ['./external-references-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ExternalReferencesViewComponent implements OnInit, OnDestroy {
    @Input() public config: ExternalReferencesPropertyConfig;
    public onEditStopSubscription: Subscription;
    public onReloadReferencesSub: Subscription;
    public referenceList: Array<[number, ExternalReference]> = [];

    constructor(private editorService: EditorService) {
        this.onEditStopSubscription = this.editorService.onEditingStopped.subscribe({
            next: () => { this.loadReferences(); } // reload references when done editing
        })
        this.onReloadReferencesSub = this.editorService.onReloadReferences.subscribe({
            next: () => { this.loadReferences(); } // reload references on text preview
        })
    }

    ngOnInit(): void {
        this.loadReferences();
    }

    ngOnDestroy(): void {
        this.onEditStopSubscription.unsubscribe();
    }

    public loadReferences(): void {
        this.referenceList = this.config.referencesField.list();
    }
}
