import {
  Component,
  ViewEncapsulation,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { MatChipSelectionChange } from '@angular/material/chips';
import { StixListComponent } from 'src/app/components/stix/stix-list/stix-list.component';
import { AttackType, WorkflowState, WorkflowStates } from 'src/app/utils/types';

@Component({
  selector: 'app-review-page',
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ReviewPageComponent implements AfterViewInit {
  sections: Array<{ label: string; type: AttackType }> = [
    { label: 'Techniques', type: 'technique' },
    { label: 'Groups', type: 'group' },
    { label: 'Campaigns', type: 'campaign' },
    { label: 'Software', type: 'software' },
    { label: 'Mitigations', type: 'mitigation' },
    { label: 'Data Sources', type: 'data-source' },
    { label: 'Data Components', type: 'data-component' },
  ];

  workflows = (
    Object.entries(WorkflowStates) as [WorkflowState, string][]
  ).filter(([k]) => k !== '');

  selectedState: WorkflowState | '' = '';

  @ViewChildren(StixListComponent) lists!: QueryList<StixListComponent>;

  ngAfterViewInit(): void {
    this.lists.changes.subscribe(() => this.pushFilters());
    queueMicrotask(() => this.pushFilters());
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
}
