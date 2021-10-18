import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-collection-import-error',
    templateUrl: './collection-import-error.component.html',
    styleUrls: ['./collection-import-error.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CollectionImportErrorComponent {
    @Input() error: any;
    @Output() onForceImport = new EventEmitter<boolean>();

    public get duplicateCollection(): boolean { return this.error.bundleErrors.duplicateCollection; }
    public get objectSpecVersionViolation(): number { return this.error.objectErrors.summary.invalidAttackSpecVersionCount; }
}
