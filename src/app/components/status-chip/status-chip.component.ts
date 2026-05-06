import { Component, Input } from '@angular/core';
import { WorkflowStatus, WorkflowStatusMap } from '../../utils/types';

@Component({
  selector: 'app-status-chip',
  standalone: false,
  templateUrl: './status-chip.component.html',
  styleUrls: ['./status-chip.component.scss'],
})
export class StatusChipComponent {
  @Input() status!: WorkflowStatus;

  public get label(): string {
    return WorkflowStatusMap[this.status] ?? String(this.status);
  }
}
