import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { ExternalReference } from 'src/app/classes/external-references';
import { Relationship } from 'src/app/classes/stix/relationship';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(control?.invalid && (control.dirty || control.touched));
  }
}

@Component({
  selector: 'app-reference-edit-dialog',
  templateUrl: './reference-edit-dialog.component.html',
  styleUrls: ['./reference-edit-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReferenceEditDialogComponent implements OnInit, OnDestroy {
  public reference: ExternalReference;
  public stixObjects: StixObject[] = [];
  public relationships: StixObject[] = [];

  public isNew: boolean;
  public stage = 0;
  public patchObjects: StixObject[];
  public patchRelationships: Relationship[];
  public dirty: boolean;

  public references$: ExternalReference[];
  public loading = true;
  public sourceNameControl: FormControl<string>;
  public matcher: CustomErrorStateMatcher;
  public validationSubscription: Subscription;

  public months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  public citation: any = {};

  public get citationTag(): string {
    return `(Citation: ${this.reference.source_name})`;
  }
  public get editing(): boolean {
    return this.config.mode == 'edit';
  }
  public get editable(): boolean {
    return this.authenticationService.canEdit();
  }
  public get deletable(): boolean {
    return this.authenticationService.canDelete();
  }
  public get numCitingObjects(): number {
    return this.stixObjects.length + this.relationships.length;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public config: ReferenceEditConfig,
    public dialogRef: MatDialogRef<ReferenceEditDialogComponent>,
    public restApiConnectorService: RestApiConnectorService,
    public snackbar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog
  ) {
    if (this.config.reference) {
      this.isNew = false;
      this.reference = this.referenceCopy;
      this.stixObjects = this.config.objects?.filter(
        sdo => sdo.attackType != 'relationship'
      );
      this.relationships = this.config.objects?.filter(
        sdo => sdo.attackType == 'relationship'
      );
    } else {
      this.isNew = true;
      this.citation.day = new FormControl(null, [
        Validators.max(31),
        Validators.min(1),
      ]);
      this.citation.year = new FormControl(null, [
        Validators.max(new Date().getFullYear()),
        Validators.min(1970),
      ]);
      this.citation.retrieved = new Date(); // default to current date
      this.reference = {
        source_name: '',
        url: '',
        description: '',
      };
    }
    this.sourceNameControl = new FormControl({
      value: this.reference.source_name,
      disabled: !this.isNew,
    });
    this.matcher = new CustomErrorStateMatcher();
  }

  ngOnInit(): void {
    // retrieve all references
    const referenceSubscription = this.restApiConnectorService
      .getAllReferences()
      .subscribe({
        next: data => {
          this.references$ = data.data;
          this.loading = false;
        },
        complete: () => referenceSubscription.unsubscribe(),
      });

    if (this.isNew) {
      // listen to source_name input changes for validation
      this.validationSubscription = this.sourceNameControl.valueChanges
        .pipe(
          debounceTime(250),
          tap(sourceName => (this.reference.source_name = sourceName)),
          switchMap(sourceName => this.validate(sourceName))
        )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    if (this.validationSubscription) this.validationSubscription.unsubscribe();
  }

  public next() {
    // trim reference fields
    this.reference.url = this.reference.url.trim();

    if (this.isNew) {
      // save new reference
      this.reference.source_name = this.reference.source_name.trim(); // trim source_name only if this is a new reference
      this.reference.description = this.getRefDescription();
      this.save();
    } else this.parsePatches(); // check for necessary patches on STIX objects
  }

  public validCitation(): boolean {
    if (!this.isNew)
      return (
        this.reference.description && this.reference.description.length > 0
      );
    else {
      // new reference
      return (
        this.citation.authors &&
        this.citation.retrieved &&
        this.validPublishedDate()
      );
    }
  }

  public validPublishedDate(): boolean {
    if (this.isNew) {
      if (this.citation.day.value && !this.citation.day.valid) return false;
      if (this.citation.year.value && !this.citation.year.valid) return false;
      if (this.citation.day.value && !this.citation.month) return false;
      if (this.citation.month && !this.citation.year.value) return false;
    }
    return true;
  }

  public get validURL(): boolean {
    if (this.reference.url) {
      // check for protocol
      if (
        !this.reference.url.startsWith('https://') &&
        !this.reference.url.startsWith('http://')
      ) {
        return false;
      }
      // check new references for uniqueness
      if (
        this.isNew &&
        this.references$.some(x => x.url && this.urlExists(x.url))
      ) {
        return false;
      }
      // check for other malformities
      try {
        new URL(this.reference.url);
      } catch (_) {
        return false;
      }
    }
    return true;
  }

  public urlExists(url) {
    return url.replace(/\//g, '') === this.reference.url.replace(/\//g, '');
  }

  public get URLError(): string {
    if (this.reference.url) {
      if (
        !this.reference.url.startsWith('https://') &&
        !this.reference.url.startsWith('http://')
      ) {
        return "URL must begin with 'http://' or 'https://'";
      } else if (this.references$.some(x => x.url && this.urlExists(x.url))) {
        const citation = this.references$.find(
          x => x.url && this.urlExists(x.url)
        );
        return `a reference with this URL already exists: (Citation: ${citation.source_name})`;
      } else {
        return 'malformed URL';
      }
    }
    return '';
  }

  public getRefDescription(): string {
    let description = '';
    if (this.citation.authors) description = `${this.citation.authors}. `;
    description += '(';
    if (
      this.citation.year.value ||
      this.citation.month ||
      this.citation.day.value
    ) {
      if (this.citation.year.value)
        description += `${this.citation.year.value}`;
      if (this.citation.year.value && this.citation.month) description += ', ';
      if (this.citation.month) description += this.citation.month;
      if (this.citation.day.value) description += ` ${this.citation.day.value}`;
    } else description += 'n.d.';
    description += '). ';

    if (this.citation.title) description += `${this.citation.title}. `;
    if (this.citation.retrieved)
      description += `Retrieved ${this.months[this.citation.retrieved.getMonth()]} ${this.citation.retrieved.getDate()}, ${this.citation.retrieved.getFullYear()}.`;
    return description;
  }

  public parsePatches() {
    this.stage = 1; //enter patching stage
    const subscription = this.restApiConnectorService
      .getAllObjects({ revoked: true, deprecated: true, deserialize: true })
      .subscribe({
        next: results => {
          // build ID to SDO lookup
          const idToObject = {};
          results.data.forEach(x => {
            idToObject[x.stixID] = x;
          });
          // find objects with given reference
          this.patchObjects = [];
          this.patchRelationships = [];
          results.data.forEach(x => {
            if (x.revoked || x.deprecated) return; // do not patch revoked/deprecated objects
            if (x.external_references.hasValue(this.reference.source_name)) {
              if (x.attackType == 'relationship')
                this.patchRelationships.push(x);
              else this.patchObjects.push(x);
            }
          });
          // patch relationship source/target names and IDs
          this.patchRelationships.forEach(relationship => {
            const serialized = relationship.serialize();
            serialized.source_object =
              idToObject[relationship.source_ref].serialize();
            serialized.target_object =
              idToObject[relationship.target_ref].serialize();
            relationship.deserialize(serialized);
          });
          this.stage = 2;
        },
        complete: () => {
          subscription.unsubscribe();
        },
      });
  }

  /**
   * Apply patches and save the reference
   */
  public patch() {
    const saves = [];
    saves.push(this.restApiConnectorService.putReference(this.reference));
    for (const object of this.patchObjects) {
      const raw = object.external_references.serialize();
      for (const reference of raw) {
        if (reference.source_name == this.reference.source_name) {
          reference.url = this.reference.url;
          reference.description = this.reference.description;
        }
      }
      object.external_references.deserialize(raw);
      saves.push(object.save(this.restApiConnectorService));
    }
    for (const relationship of this.patchRelationships) {
      let raw = relationship.external_references.serialize();
      raw = raw.map(x => {
        if (x.source_name == this.reference.source_name) return this.reference;
        else return x;
      });
      relationship.external_references.deserialize(raw);
      saves.push(relationship.save(this.restApiConnectorService));
    }
    this.stage = 3;
    const subscription = forkJoin(saves).subscribe({
      complete: () => {
        this.dirty = true; // triggers refresh of object list
        this.stopEditing();
        subscription.unsubscribe();
      },
    });
  }

  /**
   * Save the reference without patching objects using the reference
   */
  public save() {
    const save = this.isNew
      ? this.restApiConnectorService.postReference(this.reference)
      : this.restApiConnectorService.putReference(this.reference);
    const subscription = save.subscribe({
      complete: () => {
        this.isNew = false;
        this.dirty = true; // triggers refresh of object list
        this.stopEditing();
        subscription.unsubscribe();
      },
    });
  }

  /**
   * Validate reference source name
   * @param sourceName the source name input
   * @returns
   */
  public validate(sourceName: string): Observable<string> {
    this.sourceNameControl.setErrors(null); // clear previous validation

    // required
    if (!sourceName) this.sourceNameControl.setErrors({ required: true });

    // uniqueness
    if (this.references$.some(x => x.source_name == sourceName))
      this.sourceNameControl.setErrors({ nonUnique: true });

    // cannot contain special characters
    if (/[~`!@#$%^&*+=[\]';{}()|"<>?]/g.test(sourceName))
      this.sourceNameControl.setErrors({ specialCharacter: true });

    return of(sourceName);
  }

  public stopEditing(): void {
    this.config.mode = 'view';
    this.stage = 0;
  }

  public startEditing(): void {
    this.config.mode = 'edit';
  }

  public discardChanges(): void {
    this.reference = this.referenceCopy; // discard any changes
    this.stopEditing();
  }

  public close(): void {
    this.dialogRef.close(this.dirty);
  }

  /** Opens the deletion confirmation dialog and deletes the reference */
  public delete(): void {
    const prompt = this.dialog.open(DeleteDialogComponent, {
      maxWidth: '35em',
      data: {
        hardDelete: true,
      },
      disableClose: true,
      autoFocus: false, // disables auto focus on the dialog form field
    });
    const subscription = prompt.afterClosed().subscribe({
      next: confirm => {
        if (confirm) {
          // delete the reference
          const sub = this.restApiConnectorService
            .deleteReference(this.reference.source_name)
            .subscribe({
              complete: () => {
                this.dirty = true; // triggers refresh of object list
                this.close();
                if (sub) sub.unsubscribe();
              },
            });
        }
      },
      complete: () => {
        subscription.unsubscribe();
      },
    });
  }

  public get referenceCopy() {
    return JSON.parse(JSON.stringify(this.config.reference)); //deep copy
  }
}

export interface ReferenceEditConfig {
  /* What is the current mode? Default: 'view'
   *    view: viewing the reference
   *    edit: editing the reference
   */
  mode?: 'view' | 'edit';
  reference?: ExternalReference;
  objects?: StixObject[];
}
