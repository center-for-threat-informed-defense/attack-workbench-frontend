import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ObjectRefPropertyConfig } from '../object-ref-property.component';
import { MatDialog } from '@angular/material/dialog';
import { ObjectRefDialogComponent } from '../object-ref-dialog/object-ref-dialog.component';
import { StixObject } from 'src/app/classes/stix';
import { Subscription } from 'rxjs';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-object-ref-edit',
  templateUrl: './object-ref-edit.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ObjectRefEditComponent implements OnInit, OnDestroy {
  @Input() public config: ObjectRefPropertyConfig;

  public attackObjects: StixObject[];
  private subscription: Subscription;
  public loading = false;

  public get objectRefs(): StixObject[] {
    if (!this.attackObjects || this.loading) return [];
    const refIds = this.config.object[this.config.field].map(f => f.ref);
    return refIds.map(id => this.attackObjects.find(o => o.stixID === id));
  }

  constructor(
    public dialog: MatDialog,
    private apiService: RestApiConnectorService
  ) {}

  ngOnInit(): void {
    this.loadAttackObjects();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  public loadAttackObjects() {
    if (this.config.attackType == 'log-source') {
      this.loading = true;
      this.subscription = this.apiService.getAllLogSources().subscribe({
        next: results => {
          this.attackObjects = results.data;
        },
        complete: () => (this.loading = false),
      });
    }
  }

  public removeRef(i: number): void {
    // remove object reference from field
    this.config.object[this.config.field].splice(i, 1);
  }

  public editObjectRef(i?: number) {
    const dialogRef = this.dialog.open(ObjectRefDialogComponent, {
      maxHeight: '75vh',
      data: {
        object: this.config.object,
        field: this.config.field,
        attackType: this.config.attackType,
        objectRefField: this.config.objectRefField,
        relatedFields: this.config.relatedFields,
        index: i,
      },
      autoFocus: false, // prevents auto focus on form fields
    });
    const subscription = dialogRef.afterClosed().subscribe({
      next: () => this.loadAttackObjects(),
      complete: () => subscription.unsubscribe(),
    });
  }
}
