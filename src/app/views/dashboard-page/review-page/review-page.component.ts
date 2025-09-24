import {
  Component,
  ViewEncapsulation,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { MatChipSelectionChange } from '@angular/material/chips';
import { StixListComponent } from 'src/app/components/stix/stix-list/stix-list.component';
import { WorkflowState, WorkflowStates } from 'src/app/utils/types';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixListConfig } from 'src/app/components/stix/stix-list/stix-list.component';

@Component({
  selector: 'app-review-page',
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ReviewPageComponent implements AfterViewInit {
  combinedConfig: StixListConfig = {
    stixObjects: [],
    showLinks: true,
    showUserSearch: false,
    showFilters: false,
    columns: [
      ['', 'workflow', 'icon'],
      ['type', 'type', 'plain'],
      ['ID', 'attackID', 'plain'],
      ['name', 'name', 'plain'],
      ['modified', 'modified', 'timestamp'],
      ['created', 'created', 'timestamp'],
    ],
  };

  workflows = (
    Object.entries(WorkflowStates) as [WorkflowState, string][]
  ).filter(([k]) => k !== '');

  selectedState: WorkflowState | '' = '';

  @ViewChildren(StixListComponent) lists!: QueryList<StixListComponent>;

  constructor(private restAPIConnectorService: RestApiConnectorService) {}

  ngAfterViewInit(): void {
    this.lists.changes.subscribe(() => this.pushFilters());
    queueMicrotask(() => this.pushFilters());
    this.loadCombinedData();
  }

  private pushFilters(): void {
    const tokens: string[] = [];
    if (this.selectedState) tokens.push(`status.${this.selectedState}`);

    this.lists?.forEach(list => {
      list.filter = [...tokens];
      (list as any).applyControls?.();
    });
  }

  onAllToggle(evt: MatChipSelectionChange): void {
    if (evt.selected) {
      this.selectedState = '';
      this.pushFilters();
    }
  }

  onStateToggle(evt: MatChipSelectionChange, key: WorkflowState): void {
    if (!evt.selected) {
      if (this.selectedState === key) this.selectedState = '';
    } else {
      this.selectedState = key;
    }
    this.pushFilters();
  }

  private loadCombinedData(): void {
    const sub = this.restAPIConnectorService
      .getAllObjects({ limit: 1000, offset: 0, deserialize: true })
      .subscribe({
        next: res => {
          const data = Array.isArray((res as any)?.data)
            ? (res as any).data
            : [];
          this.combinedConfig.stixObjects = data;
          this.lists?.forEach(list => (list as any).applyControls?.());
        },
        complete: () => sub?.unsubscribe(),
      });
  }
}
