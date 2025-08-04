// components/stream-progress/stream-progress.component.ts
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { StreamProgress } from 'src/app/services/connectors/collection-stream.service';

@Component({
  selector: 'app-stream-progress',
  template: `
    <div class="stream-progress" *ngIf="progress$ | async as progress">
      <mat-progress-bar
        mode="determinate"
        [value]="progress.percentage"
        color="primary">
      </mat-progress-bar>
      <div class="progress-text">
        Loading collection contents: {{ progress.loaded | number }} /
        {{ progress.total | number }} ({{ progress.percentage }}%)
      </div>
    </div>
  `,
  styles: [
    `
      .stream-progress {
        padding: 16px;
        background-color: #f5f5f5;
        border-radius: 4px;
        margin-bottom: 16px;
      }
      .progress-text {
        margin-top: 8px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
        text-align: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class StreamProgressComponent {
  @Input() progress$: Observable<StreamProgress>;
}
