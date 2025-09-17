import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { LogSourceReferencePropertyConfig } from '../log-source-reference-property.component';
import { MatDialog } from '@angular/material/dialog';
import { LogSourceReferenceDialogComponent } from '../log-source-reference-dialog/log-source-reference-dialog.component';
import { DataComponent } from 'src/app/classes/stix';
import { Subscription } from 'rxjs';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { LogSourceReference } from 'src/app/classes/stix/analytic';

@Component({
  selector: 'app-log-source-reference-edit',
  templateUrl: './log-source-reference-edit.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class LogSourceReferenceEditComponent implements OnInit, OnDestroy {
  @Input() public config: LogSourceReferencePropertyConfig;

  public allDataComponents: DataComponent[];
  private subscription: Subscription;
  public loading = false;

  public get logSourceReferences(): LogSourceReference[] {
    return this.config.object['logSourceReferences'];
  }

  public get dataComponents(): DataComponent[] {
    if (!this.allDataComponents || this.loading) return [];
    const refIds = this.logSourceReferences.map(lsr => lsr.dataComponentRef);
    return refIds.map(id =>
      this.allDataComponents.find(dc => dc.stixID === id)
    );
  }

  constructor(
    public dialog: MatDialog,
    private apiService: RestApiConnectorService
  ) {}

  ngOnInit(): void {
    this.loadDataComponents(true);
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  public loadDataComponents(init: boolean) {
    this.loading = init;
    this.subscription = this.apiService.getAllDataComponents().subscribe({
      next: results => {
        this.allDataComponents = results.data as DataComponent[];
      },
      complete: () => (this.loading = false),
    });
  }

  public removeRef(i: number): void {
    this.logSourceReferences.splice(i, 1);
  }

  public editRef(i?: number) {
    const dialogRef = this.dialog.open(LogSourceReferenceDialogComponent, {
      maxHeight: '75vh',
      data: {
        object: this.config.object,
        index: i,
      },
      autoFocus: false, // prevents auto focus on form fields
    });
    const subscription = dialogRef.afterClosed().subscribe({
      next: () => this.loadDataComponents(false),
      complete: () => subscription.unsubscribe(),
    });
  }

  public getTooltip(i: number): string {
    const lsr = this.logSourceReferences[i];
    return `name: ${lsr.name}, channel: ${lsr.channel}`;
  }
}
