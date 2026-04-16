import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ReleaseTracksConnectorService } from 'src/app/services/connectors/rest-api/release-tracks.service';
import { ReleaseTrack } from 'src/app/classes/release-tracks';
import { MatDialog } from '@angular/material/dialog';
import { NewTrackDialogComponent } from 'src/app/components/new-track-dialog/new-track-dialog.component';

@Component({
  selector: 'app-release-tracks-list',
  templateUrl: './release-management.component.html',
  styleUrls: ['./release-management.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ReleaseManagementComponent implements OnInit, OnDestroy {
  @Output() viewTrack = new EventEmitter<string>();

  public filter: 'all' | 'Standard' | 'Virtual' = 'all';
  public allTracks: any[] = [];

  private subscription: Subscription | null = null;

  public get standardTracks(): any[] {
    return this.allTracks.filter(
      t => t.type === ReleaseTrack.Standard || t.type === 'standard'
    );
  }

  public get virtualTracks(): any[] {
    return this.allTracks.filter(
      t => t.type === ReleaseTrack.Virtual || t.type === 'virtual'
    );
  }

  constructor(
    private connector: ReleaseTracksConnectorService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTracks();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private loadTracks(): void {
    this.subscription = this.connector.listReleaseTracks().subscribe(result => {
      if (!result || !result.data) {
        this.allTracks = [];
        return;
      }
      this.allTracks = this.tracksWithComputedData(result.data);
    });
  }

  public setFilter(value: 'all' | 'Standard' | 'Virtual'): void {
    this.filter = value;
  }

  public onViewTrack(id: string): void {
    this.viewTrack.emit(id);
  }

  private tracksWithComputedData(data: any[]): any[] {
    return data?.map((track: any) => {
      // If snapshots are available, compute stats from them. Otherwise use
      // server-provided summary fields like latest_snapshot_modified.
      const snapshots: any[] = Array.isArray(track.snapshots)
        ? track.snapshots
        : [];

      let latestVersion: any = 'No tagged releases';
      let latestModified: any =
        track.latest_snapshot_modified ||
        track.created_at ||
        track.updated_at ||
        null;
      let stats: any = {
        candidates: 0,
        staged: 0,
        members: 0,
        quarantined: 0,
      };

      if (snapshots.length) {
        const sortedByModified = [...snapshots].sort((a, b) => {
          const ma = a?.modified || '';
          const mb = b?.modified || '';
          return String(mb).localeCompare(String(ma));
        });

        const latestSnapshot = sortedByModified[0] || null;
        const taggedSnapshots = sortedByModified.filter(
          (s: any) => s && s.version
        );
        const latestTaggedSnapshot =
          taggedSnapshots.length > 0 ? taggedSnapshots[0] : null;

        latestVersion = latestTaggedSnapshot
          ? latestTaggedSnapshot.version
          : 'No tagged releases';
        latestModified =
          latestSnapshot?.modified || latestSnapshot?.created || latestModified;

        stats = {
          candidates:
            latestSnapshot?.candidates?.length ||
            latestSnapshot?.contents?.candidates?.length ||
            0,
          staged:
            latestSnapshot?.staged?.length ||
            latestSnapshot?.contents?.staged?.length ||
            0,
          members:
            latestTaggedSnapshot?.members?.length ||
            latestTaggedSnapshot?.contents?.members?.length ||
            0,
          quarantined:
            latestSnapshot?.quarantine?.length ||
            latestSnapshot?.contents?.quarantine?.length ||
            0,
        };
      } else {
        latestVersion = track.latest_tagged_version || 'No tagged releases';
        latestModified = track.latest_snapshot_modified || latestModified;
        stats = {
          candidates: track.snapshot_count || 0,
          staged: 0,
          members: track.tagged_release_count || 0,
          quarantined: 0,
        };
      }

      return {
        ...track,
        latestVersion,
        latestModified,
        stats,
      };
    });
  }

  public openNewTrackDialog(): void {
    const dialogRef = this.dialog.open(NewTrackDialogComponent, {
      width: '50em',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      // attempt to extract an id from the result
      const createdId = result?.id || result?.track_id || null;
      if (createdId) this.viewTrack.emit(createdId);
      // refresh list to include the newly-created track
      this.loadTracks();
    });
  }
}
