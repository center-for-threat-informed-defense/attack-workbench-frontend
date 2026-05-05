import { Component, Input } from '@angular/core';
import { WorkflowState, WorkflowStates } from '../../utils/types';

@Component({
  selector: 'app-status-chip',
  standalone: false,
  templateUrl: './status-chip.component.html',
  styleUrls: ['./status-chip.component.scss'],
})
export class StatusChipComponent {
  @Input() status!: WorkflowState;

  public get label(): string {
    return WorkflowStates[this.status] ?? String(this.status);
  }
}
