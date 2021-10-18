import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-collection-import-error',
    templateUrl: './collection-import-error.component.html',
    styleUrls: ['./collection-import-error.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CollectionImportErrorComponent {
    @Input() error: any;
    @Output() onForceImport = new EventEmitter();
    @Output() onCancel = new EventEmitter();

    public get hasWarnings(): boolean {
        return this.duplicateCollection || this.duplicateObjects > 0 || this.objSpecVersionViolations > 0 || this.objSpecViolations > 0;
    }
    public get hasErrors(): boolean {
        return this.noCollection || this.multipleCollections || this.badlyFormatted;
    }

    // can be overridden
    public get duplicateCollection(): boolean { return this.error.bundleErrors.duplicateCollection; }
    public get duplicateObjects(): number { return this.error.objectErrors.summary.duplicateObjectInBundleCount; }
    public get objSpecVersionViolations(): number { return this.error.objectErrors.summary.invalidAttackSpecVersionCount; }
    public get objSpecViolations(): number { return this.error.objectErrors.errors.length - this.objSpecVersionViolations - this.duplicateObjects; }

    // cannot be overridden
    public get noCollection(): boolean { return this.error.bundleErrors.noCollection; }
    public get multipleCollections(): boolean { return this.error.bundleErrors.moreThanOneCollection; }
    public get badlyFormatted(): boolean { return this.error.bundleErrors.badlyFormattedCollection; }
}
