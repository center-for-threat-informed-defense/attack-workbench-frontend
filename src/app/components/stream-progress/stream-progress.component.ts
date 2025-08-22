// components/stream-progress/stream-progress.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StreamProgress } from 'src/app/services/connectors/collection-stream.service';

@Component({
  selector: 'app-stream-progress',
  template: `
    <div class="stream-progress">
      <mat-progress-bar mode="determinate" [value]="percentage" color="primary">
      </mat-progress-bar>
      <div class="progress-text">
        Loading collection contents: {{ loaded | number }} /
        {{ total | number }} ({{ percentage }}%)
      </div>
    </div>
  `,
  styles: [
    `
      .stream-progress {
        width: 60vw;
        padding: 16px;
        border-radius: 4px;
        margin: auto;
        .progress-text {
          margin-top: 8px;
          text-align: center;
        }
      }
    `,
  ],
  standalone: false,
})
export class StreamProgressComponent implements OnInit {
  @Input() progress$: Observable<StreamProgress>;

  public loaded: number;
  public total: number;
  public percentage: number;

  ngOnInit(): void {
    this.progress$.subscribe({
      next: result => {
        this.loaded = result.loaded ?? 0;
        this.total = result.total ?? 0;
        this.percentage = result.percentage ?? 0;
      },
    });
  }
}
