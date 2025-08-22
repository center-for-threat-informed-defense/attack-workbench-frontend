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
  standalone: false,
})
export class StreamProgressComponent implements OnInit {
  @Input() progress$: Observable<StreamProgress>;

  public loaded: number = 0;
  public total: number = 0;
  public percentage: number = 0;

  ngOnInit(): void {
    this.progress$.subscribe({
      next: result => {
        this.loaded = result.loaded;
        this.total = result.total;
        this.percentage = this.loaded / this.total;
      },
    });
  }
}
