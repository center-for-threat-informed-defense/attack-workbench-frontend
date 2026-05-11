import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StixTypeToAttackType } from 'src/app/utils/type-mappings';
import { StixType, WorkflowStatusType } from 'src/app/utils/types';

export interface ReleaseTrackReviewItem {
  object_ref: string;
  object_modified?: Date | string;
  object_status?: WorkflowStatusType;
  object_added_at?: Date | string;
  object_added_by?: string;
  object_staged_at?: Date | string;
  object_staged_by?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-release-track-review-card',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './release-track-review-card.component.html',
  styleUrls: ['./release-track-review-card.component.scss'],
})
export class ReleaseTrackReviewCardComponent {
  @Input({ required: true }) item!: ReleaseTrackReviewItem;
  @Input() cardType: string | null = null;
  @Input() laneStatus: WorkflowStatusType | null = null;
  @Input() showDescription = true;
  @Input() showDiff = true;
  @Input() showModifiedMeta = true;

  @Output() viewObject = new EventEmitter<ReleaseTrackReviewItem>();
  @Output() diffObject = new EventEmitter<ReleaseTrackReviewItem>();

  public get title(): string {
    return this.item?.name || this.fallbackObjectLabel;
  }

  public get subtitle(): string {
    return this.item?.attackId || '<<ATT&CK ID>>';
  }

  public get description(): string {
    const description = this.item?.description || 'No description available.';
    return this.firstParagraph(description);
  }

  public get modified(): Date | string | null {
    return this.item?.object_modified || null;
  }

  public get modifiedByInitials(): string {
    const value = this.item?.modified_by_user || '?';
    const parts = value.split(/\s+/).filter(Boolean);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return value.slice(0, 2).toUpperCase();
  }

  public get cardClasses(): Record<string, boolean> {
    return {
      [`status-${this.laneStatus}`]: !!this.laneStatus,
      [`is-${this.cardType}`]: !!this.cardType,
      'has-description': this.showDescription,
    };
  }

  public onView(): void {
    this.viewObject.emit(this.item);
  }

  public onDiff(): void {
    this.diffObject.emit(this.item);
  }

  private get fallbackObjectLabel(): string {
    const [type, id] = (this.item?.object_ref || '').split('--');
    if (!type || !id) return this.item?.object_ref || 'Unknown object';
    return `${this.toDisplayLabel(type as StixType)} ${id.slice(0, 8)}`;
  }

  private toDisplayLabel(value: StixType): string {
    if (!value) return '';
    return StixTypeToAttackType[value]
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  private firstParagraph(value: string): string {
    const [paragraph] = value
      .replace(/\r\n/g, '\n')
      .split(/\n\s*\n|\n/)
      .map(part => part.trim())
      .filter(Boolean);
    return paragraph || 'No description available.';
  }
}
