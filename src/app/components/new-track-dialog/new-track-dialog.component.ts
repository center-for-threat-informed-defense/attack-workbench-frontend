import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  WorkflowStatus,
  MemberSyncStrategy,
  MemberSyncBehavior,
  ReleaseTrack,
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

  public candidacyOptions = Object.values(WorkflowStatus);
  public memberSyncOptions = Object.values(MemberSyncStrategy);
  public supplantOptions = Object.values(MemberSyncBehavior);

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
    });
  }

  ngOnInit(): void {
    if (this.data) {
      const init = this.data || {};
      if (init.name) this.form.get('name')?.setValue(init.name);
      if (init.description)
        this.form.get('description')?.setValue(init.description);
      if (typeof init.autoPromote !== 'undefined')
        this.form.get('autoPromote')?.setValue(!!init.autoPromote);
      if (init.candidacyThreshold)
        this.form.get('candidacyThreshold')?.setValue(init.candidacyThreshold);
      if (init.memberSync)
        this.form.get('memberSync')?.setValue(init.memberSync);
      if (init.supplantBehavior)
        this.form.get('supplantBehavior')?.setValue(init.supplantBehavior);
    }

    const autoCtrl = this.form.get('autoPromote');
    const candidacyCtrl = this.form.get('candidacyThreshold');
    if (autoCtrl && candidacyCtrl) {
      // Initialize based on current value
      if (autoCtrl.value) candidacyCtrl.enable({ emitEvent: false });
      else candidacyCtrl.disable({ emitEvent: false });

      // Subscribe to changes to enable/disable control
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
    return this.form.valid && !!this.form.get('name')?.value?.trim();
  }

  public handleCreate(): void {
    if (!this.isFormValid() || this.loading) return;

    const payload: any = {
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
      config: {
        auto_promote: !!this.form.get('autoPromote')?.value,
        candidacy_threshold: this.form.get('candidacyThreshold')?.value,
        member_sync: {
          strategy: this.form.get('memberSync')?.value,
          supplant: this.form.get('supplantBehavior')?.value,
        },
      },
      type: ReleaseTrack.Standard,
    };

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
