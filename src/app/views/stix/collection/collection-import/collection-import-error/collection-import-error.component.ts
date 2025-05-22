import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-collection-import-error',
  templateUrl: './collection-import-error.component.html',
  styleUrls: ['./collection-import-error.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class CollectionImportErrorComponent {
  @Input() error: any;
  @Output() onCancel = new EventEmitter();

  public get hasWarnings(): boolean {
    return this.duplicateCollection || this.objSpecVersionViolations > 0;
  }
  public get hasErrors(): boolean {
    return (
      this.noCollection ||
      this.multipleCollections ||
      this.badlyFormatted ||
      this.duplicateObjects > 0
    );
  }

  // can be overridden
  public get duplicateCollection(): boolean {
    return this.error.bundleErrors.duplicateCollection;
  }
  public get objSpecVersionViolations(): number {
    return this.error.objectErrors.summary.invalidAttackSpecVersionCount;
  }

  // cannot be overridden
  public get noCollection(): boolean {
    return this.error.bundleErrors.noCollection;
  }
  public get duplicateObjects(): number {
    return this.error.objectErrors.summary.duplicateObjectInBundleCount;
  }
  public get multipleCollections(): boolean {
    return this.error.bundleErrors.moreThanOneCollection;
  }
  public get badlyFormatted(): boolean {
    return this.error.bundleErrors.badlyFormattedCollection;
  }
}
