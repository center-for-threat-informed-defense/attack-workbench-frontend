import { Component, Inject, OnInit } from '@angular/core';
import { ObjectRefField, RelatedField } from '../object-ref-property.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { FormControl } from '@angular/forms';
import { StixObject } from 'src/app/classes/stix';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { LogSourceReference } from 'src/app/classes/stix/analytic';
import { AttackType } from 'src/app/utils/types';

@Component({
  selector: 'app-object-ref-dialog',
  templateUrl: './object-ref-dialog.component.html',
  styleUrl: './object-ref-dialog.component.scss',
  standalone: false,
})
export class ObjectRefDialogComponent implements OnInit {
  public isNew = false;

  // object reference field
  public refCtrl = new FormControl(null);
  public filteredObjects$: Observable<StixObject[]>;

  // related fields
  public selectControls: Record<string, FormControl> = {};

  constructor(
    public dialogRef: MatDialogRef<ObjectRefDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public config: ObjectRefDialogConfig,
    public apiService: RestApiConnectorService
  ) {}

  ngOnInit(): void {
    this.isNew = this.config.index === undefined;
    // set up form controls for each related field
    this.config.relatedFields.forEach(relatedField => {
      this.selectControls[relatedField.field] = new FormControl({
        value: [],
        disabled: true,
      });
    });
    // handle user search
    this.filteredObjects$ = this.refCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(query => this.filterObjects(query))
    );
    // clear related fields when a new object is selected
    this.refCtrl.valueChanges.subscribe(() => {
      const shouldEnable = this.isValid();
      Object.values(this.selectControls).forEach(ctrl => {
        ctrl.setValue([]);
        if (shouldEnable) ctrl.enable();
        else ctrl.disable();
      });
    });
    // set up initial value
    if (!this.isNew) {
      const refData: LogSourceReference =
        this.config.object[this.config.field][this.config.index];
      this.initializeObjectRef(
        refData[this.config.objectRefField.field]
      ).subscribe(obj => {
        if (obj) {
          this.refCtrl.setValue(obj);
          this.config.relatedFields.forEach(rf => {
            const initialVal = refData[rf.field] ?? [];
            this.selectControls[rf.field].setValue(initialVal);
            this.selectControls[rf.field].enable();
          });
        }
      });
    }
  }

  public displayWith(obj: StixObject): string {
    return obj?.attackID ?? '';
  }

  public relatedFieldOptions(field: string): string[] {
    if (!this.refCtrl.value) return [];
    const relatedField = this.config.relatedFields.find(
      rf => rf.field === field
    );
    if (!relatedField) return [];
    const refValue = this.refCtrl.value[relatedField.refField];
    if (!refValue) return [];

    if (Array.isArray(refValue) && relatedField.key) {
      return refValue.map(v => v && v[relatedField.key]).filter(v => v != null);
    } else {
      return refValue;
    }
  }

  public remove(field: string, value: string): void {
    const values = this.selectControls[field].value as string[];
    const i = values.indexOf(value);
    if (i >= 0) values.splice(i, 1);
    this.selectControls[field].setValue(values);
  }

  public isValid(): boolean {
    return (
      !!this.refCtrl.value &&
      typeof this.refCtrl.value === 'object' &&
      this.refCtrl.value.stixID
    );
  }

  public confirm(): void {
    const data = {};
    data[this.config.objectRefField.field] = this.refCtrl.value?.stixID;
    this.config.relatedFields.forEach(f => {
      data[f.field] = this.selectControls[f.field].value;
    });

    if (this.isNew) {
      this.config.object[this.config.field].push(data);
    } else {
      // update existing value
      this.config.object[this.config.field][this.config.index] = data;
    }

    this.dialogRef.close();
  }

  public isAlreadyReferenced(obj: StixObject) {
    const existingRefs = this.config.object[this.config.field] || [];
    const refIds = existingRefs.map(item => item.ref);
    return refIds.includes(obj.stixID);
  }

  private filterObjects(query?: string): Observable<StixObject[]> {
    const options = {
      search: query,
    };
    if (this.config.attackType === 'log-source') {
      return this.apiService
        .getAllLogSources(options)
        .pipe(map(results => results.data));
    }
    return of([]); // fallback
  }

  private initializeObjectRef(stixID: string) {
    if (this.config.attackType === 'log-source') {
      return this.apiService
        .getLogSource(stixID, null, 'latest')
        .pipe(map(result => result[0] || null));
    }
  }
}

export interface ObjectRefDialogConfig {
  /** The object to show the field of */
  object: StixObject | [StixObject, StixObject];
  /** The field of the object */
  field: string;
  /** The attack type of the object references */
  attackType: AttackType;
  /** The object reference field */
  objectRefField: ObjectRefField;
  /** The fields related to the referenced objects */
  relatedFields?: RelatedField[];
  index?: number;
}
