import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReleaseTrackSnapshot } from 'src/app/classes/release-tracks';
import { ReleaseTracksConnectorService } from 'src/app/services/connectors/rest-api/release-tracks.service';
import { BreadcrumbService } from 'src/app/services/helpers/breadcrumb.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { AddDialogComponent } from 'src/app/components/add-dialog/add-dialog.component';
import { StixTypeToAttackType } from 'src/app/utils/type-mappings';
import { StixType } from 'src/app/utils/types';

@Component({
  selector: 'app-release-track-page',
  standalone: false,
  templateUrl: './release-track-page.component.html',
  styleUrls: ['./release-track-page.component.scss'],
})
export class ReleaseTrackPageComponent implements OnInit {
  public id = '';
  public releaseTrack: ReleaseTrackSnapshot | null = null;

  constructor(
    private connector: ReleaseTracksConnectorService,
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private restApiConnectorService: RestApiConnectorService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params.id;
      if (this.id) this.getReleaseTrack();
    });
  }

  public get candidates(): any[] {
    return this.releaseTrack?.candidates ?? [];
  }

  public get staged(): any[] {
    return this.releaseTrack?.staged ?? [];
  }

  public get members(): any[] {
    return this.releaseTrack?.members ?? [];
  }

  public getReleaseTrack(): void {
    const subscription = this.connector.getLatestSnapshot(this.id).subscribe({
      next: res => {
        this.releaseTrack = res;
        this.breadcrumbService.changeBreadcrumb(
          this.route.snapshot,
          this.releaseTrack!.name
        );

        // this.loadCandidates();
      },
      complete: () => {
        subscription.unsubscribe();
      },
    });
  }

  /**
   * Load candidates using ReleaseTracksConnectorService.listCandidates()
   */
  // private loadCandidates(): void {
  //   if (!this.id) return;
  //   const sub = this.connector.listCandidates(this.id).subscribe({
  //     next: res => {
  //       const list = (res && (res as any).data) ? (res as any).data : (Array.isArray(res) ? res : []);
  //       this._candidates = list as any[];
  //       if (this.releaseTrack) this.releaseTrack.candidates = this._candidates;
  //     },
  //     error: err => {
  //       console.error('Failed to list candidates for track', this.id, err);
  //     },
  //     complete: () => sub.unsubscribe(),
  //   });
  // }

  public onAddCandidate(): void {
    if (!this.releaseTrack) return;

    const selection = new SelectionModel<string>(true);

    const sub = this.restApiConnectorService
      .getAllObjects({ deserialize: true })
      .subscribe({
        next: results => {
          const objects = (results as any).data || [];

          const dialogRef = this.dialog.open(AddDialogComponent, {
            data: {
              selectableObjects: objects,
              select: selection,
              type: 'all',
              selectionType: 'many',
              buttonLabel: 'Add',
              title: 'Add candidates',
              clearSelection: true,
            },
            maxWidth: '70em',
            minWidth: '40vw',
            maxHeight: '75vh',
          });

          const closeSub = dialogRef.afterClosed().subscribe({
            next: result => {
              if (!result) return; // user cancelled

              const objectRefs: any[] = selection.selected.map(stixId => {
                const obj = objects.find(
                  (o: any) =>
                    o.stixID === stixId || (o.stix && o.stix.id === stixId)
                );
                const id = obj ? obj.stixID || obj.stix?.id : stixId;
                let modified: string | undefined;
                if (obj) {
                  if (obj.modified instanceof Date)
                    modified = obj.modified.toISOString();
                  else if (obj.modified) modified = obj.modified;
                  else if (obj.stix && obj.stix.modified)
                    modified = obj.stix.modified;
                }
                return modified ? { id, modified } : id;
              });

              const apiSub = this.connector
                .addCandidates(this.id, objectRefs)
                .subscribe({
                  next: () => {
                    // refresh snapshot from server so local state reflects saved candidates
                    this.getReleaseTrack();
                  },
                  error: err => {
                    console.error('Failed to add candidates', err);
                  },
                  complete: () => apiSub.unsubscribe(),
                });
            },
            complete: () => closeSub.unsubscribe(),
          });
        },
        complete: () => sub.unsubscribe(),
      });
  }

  public getViewUrl(stixId: string): string {
    const stixType = stixId.split('-')[0] as StixType;
    return `/${StixTypeToAttackType[stixType]}/${stixId}`;
  }

  public onPromoteAll(): void {
    // TODO: implement batch promote logic
    console.log('onPromoteAll clicked');
  }

  public onPromote(item: any): void {
    // TODO: implement promote single item
    console.log('onPromote', item);
  }

  public onDemoteAll(): void {
    // TODO: implement batch demote logic
    console.log('onDemoteAll clicked');
  }

  public onDemote(item: any): void {
    // TODO: implement demote single item
    console.log('onDemote', item);
  }

  public onView(id: string): void {
    this.router.navigate([this.getViewUrl(id)]);
  }

  public onDiff(item: any): void {
    // TODO: open diff modal for item
    console.log('onDiff', item);
  }
}
