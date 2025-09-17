import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { FormControl } from '@angular/forms';
import { DataComponent, StixObject } from 'src/app/classes/stix';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import { LogSourceReference } from 'src/app/classes/stix/analytic';
import { LogSource } from 'src/app/classes/stix/data-component';

@Component({
  selector: 'app-log-source-reference-dialog',
  templateUrl: './log-source-reference-dialog.component.html',
  styleUrl: './log-source-reference-dialog.component.scss',
  standalone: false,
})
export class LogSourceReferenceDialogComponent implements OnInit {
  public isNew = false;
  public dataComponentCtrl = new FormControl(null);
  public logSourceCtrl = new FormControl(null);
  public logSources: LogSource[] = [];
  public filteredDataComponents$: Observable<DataComponent[]>;

  public get logSourceReferences(): LogSourceReference[] {
    return this.config.object['logSourceReferences'];
  }

  constructor(
    public dialogRef: MatDialogRef<LogSourceReferenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public config: LogSourceReferenceDialogConfig,
    public apiService: RestApiConnectorService
  ) {}

  ngOnInit(): void {
    this.isNew = this.config.index === undefined;

    // handle autocomplete for data components
    this.filteredDataComponents$ = this.dataComponentCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(query => this.filterDataComponents(query))
    );

    // when data component changes, update log sources
    this.dataComponentCtrl.valueChanges.subscribe(dc => {
      this.logSources = dc?.logSources || [];
      this.logSourceCtrl.reset();
      if (dc) this.logSourceCtrl.enable();
      else this.logSourceCtrl.disable();
    });

    if (!this.isNew) {
      // set up initial value
      const lsr: LogSourceReference =
        this.logSourceReferences[this.config.index];
      this.getDataComponent(lsr.dataComponentRef).subscribe(dc => {
        if (dc) {
          this.dataComponentCtrl.setValue(dc);
          this.logSources = dc?.logSources || [];
          const initLogSource = this.logSources.find(
            ls => ls.name === lsr.name && ls.channel === lsr.channel
          );
          if (initLogSource) this.logSourceCtrl.setValue(initLogSource);
        }
      });
    } else {
      this.logSourceCtrl.disable();
    }
  }

  public displayWith(dc: DataComponent): string {
    return dc ? `${dc.name} (${dc.attackID})` : '';
  }

  public isValid(): boolean {
    return !!this.dataComponentCtrl.value && !!this.logSourceCtrl.value;
  }

  public confirm(): void {
    const lsr: LogSourceReference = {
      dataComponentRef: this.dataComponentCtrl.value.stixID,
      name: this.logSourceCtrl.value.name,
      channel: this.logSourceCtrl.value.channel,
    };

    if (this.isNew) {
      this.logSourceReferences.push(lsr);
    } else {
      // update existing value
      this.logSourceReferences[this.config.index] = lsr;
    }

    this.dialogRef.close();
  }

  public isAlreadyReferenced(logSource: LogSource) {
    const match = this.logSourceReferences.find(
      lsr => lsr.name === logSource.name && lsr.channel === logSource.channel
    );
    return !!match;
  }

  private filterDataComponents(query?: string): Observable<DataComponent[]> {
    const options = {
      search: query,
    };
    return this.apiService
      .getAllDataComponents(options)
      .pipe(map(results => results.data as DataComponent[]));
  }

  private getDataComponent(stixID: string) {
    return this.apiService
      .getDataComponent(stixID, null, 'latest')
      .pipe(map(result => result[0] || null));
  }
}

export interface LogSourceReferenceDialogConfig {
  /** The object to show the field of */
  object: StixObject | [StixObject, StixObject];
  index?: number;
}
