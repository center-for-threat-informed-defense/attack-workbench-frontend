import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LogSourceReferencePropertyConfig } from '../log-source-reference-property.component';
import { DataComponent } from 'src/app/classes/stix';
import { Subscription } from 'rxjs';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { LogSourceReference } from 'src/app/classes/stix/analytic';

@Component({
  selector: 'app-log-source-reference-diff',
  templateUrl: './log-source-reference-diff.component.html',
  standalone: false,
})
export class LogSourceReferenceDiffComponent implements OnInit, OnDestroy {
  @Input() public config: LogSourceReferencePropertyConfig;

  public fields = ['dataComponentRef', 'name', 'channel'];
  public diffTable: any[] = [];
  public loading = false;
  public dataComponents: DataComponent[];
  private subscription: Subscription;

  public get current(): LogSourceReference[] {
    return this.config.object[0]?.['logSourceReferences'] || [];
  }
  public get previous(): LogSourceReference[] {
    return this.config.object[1]?.['logSourceReferences'] || [];
  }

  constructor(private apiService: RestApiConnectorService) {}

  ngOnInit(): void {
    this.loadDataComponents();
    this.diffTable = this.mergeTable();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  public loadDataComponents() {
    this.loading = true;
    this.subscription = this.apiService.getAllDataComponents().subscribe({
      next: results => {
        this.dataComponents = results.data as DataComponent[];
      },
      complete: () => (this.loading = false),
    });
  }

  private mergeTable(): any[] {
    const getString = (lsr: LogSourceReference) =>
      `${lsr.dataComponentRef}::${lsr.name}::${lsr.channel}`;

    const matchedPrev = new Set();
    const merged = [];

    // for each current entry, find a matching previous entry
    this.current.forEach(currItem => {
      const prevIdx = this.previous.findIndex(
        prevItem => getString(prevItem) === getString(currItem)
      );
      if (prevIdx !== -1) {
        // entry unchanged
        merged.push({
          before: this.previous[prevIdx],
          after: currItem,
        });
        matchedPrev.add(prevIdx);
      } else {
        // entry added
        merged.push({
          before: null,
          after: currItem,
        });
      }
    });

    // add any previous entries not matched
    this.previous.forEach((prevItem, prevIdx) => {
      if (!matchedPrev.has(prevIdx)) {
        // entry removed
        merged.push({
          before: prevItem,
          after: null,
        });
      }
    });
    return merged;
  }

  /**
   * Get the name for the given STIX ID
   * @param {string} stixID data component STIX ID
   */
  public getName(stixID: string): string {
    return this.dataComponents?.find(dc => dc.stixID === stixID)?.name;
  }

  /**
   * Get the ATT&CK ID for the given STIX ID
   * @param {string} stixID data component STIX ID
   */
  public getAttackId(stixID: string): string {
    return (
      this.dataComponents?.find(dc => dc.stixID === stixID)?.attackID ?? ''
    );
  }
}
