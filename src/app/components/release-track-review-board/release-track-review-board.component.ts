import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ReleaseTrackReviewCardComponent,
  ReleaseTrackReviewItem,
} from 'src/app/components/release-track-review-card/release-track-review-card.component';
import { WorkflowStatus, WorkflowStatusType } from 'src/app/utils/types';

interface ReleaseTrackReviewLane {
  status: WorkflowStatusType;
  title: string;
  modifier: string;
  searchPlaceholder: string;
  emptyLabel: string;
}

@Component({
  selector: 'app-release-track-review-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    ReleaseTrackReviewCardComponent,
  ],
  templateUrl: './release-track-review-board.component.html',
  styleUrls: ['./release-track-review-board.component.scss'],
})
export class ReleaseTrackReviewBoardComponent {
  @Input() items: ReleaseTrackReviewItem[] = [];

  @Output() viewObject = new EventEmitter<ReleaseTrackReviewItem>();
  @Output() diffObject = new EventEmitter<ReleaseTrackReviewItem>();
  @Output() bulkReview = new EventEmitter<ReleaseTrackReviewItem[]>();

  public readonly WorkflowStatus = WorkflowStatus;

  public readonly lanes: ReleaseTrackReviewLane[] = [
    {
      status: WorkflowStatus.WorkInProgress,
      title: 'Work in Progress',
      modifier: 'work-in-progress',
      searchPlaceholder: 'Search WIP...',
      emptyLabel: 'No work in progress',
    },
    {
      status: WorkflowStatus.AwaitingReview,
      title: 'Awaiting Review',
      modifier: 'awaiting-review',
      searchPlaceholder: 'Search Awaiting Review...',
      emptyLabel: 'No objects awaiting review',
    },
    {
      status: WorkflowStatus.Reviewed,
      title: 'Reviewed / Ready',
      modifier: 'reviewed',
      searchPlaceholder: 'Search Reviewed...',
      emptyLabel: 'No reviewed objects',
    },
  ];

  public searchTerms: Record<WorkflowStatusType, string> = {
    [WorkflowStatus.WorkInProgress]: '',
    [WorkflowStatus.AwaitingReview]: '',
    [WorkflowStatus.Reviewed]: '',
  };

  public getLaneItems(lane: ReleaseTrackReviewLane): ReleaseTrackReviewItem[] {
    const query = this.searchTerms[lane.status].trim().toLowerCase();
    return this.items
      .filter(
        item =>
          (item.object_status || WorkflowStatus.WorkInProgress) === lane.status
      )
      .filter(item => !query || this.searchText(item).includes(query));
  }

  public isReviewLane(lane: ReleaseTrackReviewLane): boolean {
    return lane.status === WorkflowStatus.AwaitingReview;
  }

  public onBulkReview(items: ReleaseTrackReviewItem[]): void {
    this.bulkReview.emit(items);
  }

  public trackByObjectRef(
    _index: number,
    item: ReleaseTrackReviewItem
  ): string {
    return `${item.object_ref}-${item.object_modified || ''}`;
  }

  private searchText(item: ReleaseTrackReviewItem): string {
    try {
      return JSON.stringify(item).toLowerCase();
    } catch {
      return [
        item.object_ref,
        item.object_status,
        item.name,
        item.description,
        item.attackID,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
    }
  }
}
