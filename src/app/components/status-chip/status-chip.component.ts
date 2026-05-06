import { Component, Input } from '@angular/core';
import { WorkflowStatus, WorkflowStatusMap } from '../../utils/types';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-status-chip',
  standalone: false,
  templateUrl: './status-chip.component.html',
  styleUrls: ['./status-chip.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StatusChipComponent {
  @Input() status!: WorkflowStatus;

  public get label(): string {
    return WorkflowStatusMap[this.status] ?? String(this.status);
  }
}
