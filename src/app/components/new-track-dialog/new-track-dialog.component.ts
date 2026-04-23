import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  WorkflowStatus,
  MemberSyncStrategy,
  MemberSyncBehavior,
  ReleaseTrackType,
  DeduplicationStrategy,
  SnapshotTier,
  SnapshotScheduleMode,
} from 'src/app/classes/release-tracks/enums';
import { ReleaseTracksConnectorService } from 'src/app/services/connectors/rest-api/release-tracks.service';

@Component({
  standalone: false,
  selector: 'app-new-track-dialog',
  templateUrl: './new-track-dialog.component.html',
  styleUrls: ['./new-track-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NewTrackDialogComponent implements OnInit {
  public form: FormGroup;
  public loading = false;

  public WorkflowStatus = WorkflowStatus;
  public MemberSyncStrategy = MemberSyncStrategy;
  public MemberSyncBehavior = MemberSyncBehavior;
  public ReleaseTrack = ReleaseTrackType;

  public candidacyOptions = Object.values(WorkflowStatus);
  public memberSyncOptions = Object.values(MemberSyncStrategy);
  public supplantOptions = Object.values(MemberSyncBehavior);

  public deduplicationOptions = Object.values(DeduplicationStrategy);
  public deduplicationTierOptions = Object.values(SnapshotTier);
  public deduplicationStatusOptions = Object.values(WorkflowStatus);
  public snapshotModeOptions = Object.values(SnapshotScheduleMode);

  public mode: 'standard' | 'virtual' = 'standard';

  public get isVirtual() {
    return this.mode === ReleaseTrackType.Virtual;
  }

  constructor(
    public dialogRef: MatDialogRef<NewTrackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private connector: ReleaseTracksConnectorService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      autoPromote: [false],
      candidacyThreshold: [{ value: WorkflowStatus.Reviewed, disabled: true }],
      memberSync: [MemberSyncStrategy.TrackLatest],
      supplantBehavior: [MemberSyncBehavior.Replace],
      composition: this.fb.group({
        deduplicationStrategy: [this.deduplicationOptions[0]],
        deduplicationTier: [this.deduplicationTierOptions[0]],
        deduplicationStatus: [this.deduplicationStatusOptions[0]],
      }),
      snapshotSchedule: this.fb.group({
        mode: [this.snapshotModeOptions[0]],
        cron: [''],
      }),
    });

    // Initialize mode from dialog data (if provided)
    if (this.data && this.data.type) {
      this.mode = this.data.type as ReleaseTrackType;
    }
  }

  ngOnInit(): void {
    if (this.isVirtual) {
      this.form.get('composition')?.setValidators([Validators.required]);
      this.form
        .get('composition')
        ?.updateValueAndValidity({ emitEvent: false });
    }

    const autoCtrl = this.form.get('autoPromote');
    const candidacyCtrl = this.form.get('candidacyThreshold');
    if (autoCtrl && candidacyCtrl) {
      // enable/disable candidacy threshold input based on auto promote value
      autoCtrl.valueChanges.subscribe(value => {
        if (value) candidacyCtrl.enable();
        else candidacyCtrl.disable();
      });
    }
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public isFormValid(): boolean {
    const nameValid = !!this.form.get('name')?.value?.trim();
    if (this.isVirtual) {
      const ded = this.form.get('composition.deduplicationStrategy')?.value;
      return nameValid && !!ded;
    }
    return this.form.valid && nameValid;
  }

  public handleCreate(): void {
    if (!this.isFormValid() || this.loading) return;

    let payload: any;
    if (this.isVirtual) {
      const compGroup = this.form.get('composition') as FormGroup;
      let composition: any = undefined;
      if (compGroup) {
        const strategy = compGroup.get('deduplicationStrategy')?.value;
        const tier = compGroup.get('deduplicationTier')?.value;
        const status = compGroup.get('deduplicationStatus')?.value;

        composition = { deduplication: {} };
        if (strategy) composition.deduplication.strategy = strategy;
        if (tier) composition.deduplication.tier_resolution = tier;
        if (status) composition.deduplication.status_resolution = status;
      }

      const snapshotSchedule = this.form.get('snapshotSchedule') as FormGroup;
      let snapshot_schedule: any = undefined;
      if (snapshotSchedule) {
        const mode = snapshotSchedule.get('mode')?.value;
        const cron = snapshotSchedule.get('cron')?.value;
        if (mode) {
          snapshot_schedule = { mode };
          if (mode === 'cron' && cron) snapshot_schedule.cron = cron;
        }
      }

      payload = {
        name: this.form.get('name')?.value,
        description: this.form.get('description')?.value,
        composition: composition,
        snapshot_schedule: snapshot_schedule,
        type: ReleaseTrackType.Virtual,
      };
    } else {
      payload = {
        name: this.form.get('name')?.value,
        description: this.form.get('description')?.value,
        config: {
          auto_promote: !!this.form.get('autoPromote')?.value,
          member_sync: {
            strategy: this.form.get('memberSync')?.value,
            supplant: this.form.get('supplantBehavior')?.value,
          },
        },
        type: ReleaseTrackType.Standard,
      };
      if (payload.config.auto_promote) {
        payload.config.candidacy_threshold =
          this.form.get('candidacyThreshold')?.value;
      }
    }

    this.loading = true;
    const subscription = this.connector.createReleaseTrack(payload).subscribe({
      next: result => {
        this.dialogRef.close(result);
      },
      error: () => {
        // leave dialog open and stop loading
        this.loading = false;
      },
      complete: () => {
        if (subscription) subscription.unsubscribe();
      },
    });
  }
}
