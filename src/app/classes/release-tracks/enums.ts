// -----------------------------------------------------------------------------
// Release Track Type
// -----------------------------------------------------------------------------

export enum ReleaseTrackType {
  Standard = 'standard',
  Virtual = 'virtual',
}

export const RELEASE_TRACK_TYPE_OPTIONS: ReleaseTrackType[] = Object.values(
  ReleaseTrackType
) as ReleaseTrackType[];

// -----------------------------------------------------------------------------
// Conflict Resolution
// -----------------------------------------------------------------------------

export enum ConflictPolicy {
  AlwaysOverwrite = 'always_overwrite', // replace with incoming entry
  AlwaysReject = 'always_reject', // always reject incoming
  PreferLatest = 'prefer_latest', // keep whichever has newer object_modified
  Abort = 'abort', // throw error on any conflict
}

export type ConflictPolicyType =
  | ConflictPolicy.AlwaysOverwrite
  | ConflictPolicy.AlwaysReject
  | ConflictPolicy.PreferLatest
  | ConflictPolicy.Abort;

export const CONFLICT_POLICY_OPTIONS: ConflictPolicyType[] = Object.values(
  ConflictPolicy
) as ConflictPolicyType[];

// -----------------------------------------------------------------------------
// Deduplication Strategy
// -----------------------------------------------------------------------------

export enum DeduplicationStrategy {
  PrioritizeLatestObject = 'prioritize_latest_object', // keep version with newest object_modified
  PrioritizeLatestSnapshot = 'prioritize_latest_snapshot', // keep version from most recently modified snapshot
  PrioritizeHigherPriority = 'prioritize_higher_priority', // keep version from the higher-priority conmponent (lower number)
  Quarantine = 'quarantine', // send all conflicting versions to quarantine for manual review
}

export type DeduplicationStrategyType =
  | DeduplicationStrategy.PrioritizeLatestObject
  | DeduplicationStrategy.PrioritizeLatestSnapshot
  | DeduplicationStrategy.PrioritizeHigherPriority
  | DeduplicationStrategy.Quarantine;

export const DEDUPLICATION_STRATEGY_OPTIONS: DeduplicationStrategyType[] =
  Object.values(DeduplicationStrategy) as DeduplicationStrategyType[];

// -----------------------------------------------------------------------------
// Export Format
// -----------------------------------------------------------------------------

export enum ExportFormat {
  Snapshot = 'snapshot',
  Bundle = 'bundle',
  Workbench = 'workbench',
  FileSystemStore = 'filesystemstore',
}

export type ExportFormatType =
  | ExportFormat.Snapshot
  | ExportFormat.Bundle
  | ExportFormat.Workbench
  | ExportFormat.FileSystemStore;

export const EXPORT_FORMAT_OPTIONS: ExportFormatType[] = Object.values(
  ExportFormat
) as ExportFormatType[];

// -----------------------------------------------------------------------------
// Release Track Snapshot Tiers
// -----------------------------------------------------------------------------

export enum SnapshotTier {
  Member = 'released',
  Staged = 'staged',
  Candidate = 'candidate',
  All = 'all',
}

export type SnapshotTierType =
  | SnapshotTier.Member
  | SnapshotTier.Staged
  | SnapshotTier.Candidate
  | SnapshotTier.All;

export const SNAPSHOT_TIER_OPTIONS: SnapshotTierType[] = Object.values(
  SnapshotTier
) as SnapshotTierType[];

// -----------------------------------------------------------------------------
// Workflow Statuses
// -----------------------------------------------------------------------------

export enum WorkflowStatus {
  WorkInProgress = 'work-in-progress',
  AwaitingReview = 'awaiting-review',
  Reviewed = 'reviewed',
}

export type WorkflowStatusType =
  | WorkflowStatus.WorkInProgress
  | WorkflowStatus.AwaitingReview
  | WorkflowStatus.Reviewed;

// -----------------------------------------------------------------------------
// Candidacy Thresholds
// -----------------------------------------------------------------------------

export const CANDIDACY_THRESHOLD_OPTIONS: WorkflowStatusType[] = Object.values(
  WorkflowStatus
) as WorkflowStatusType[];

// -----------------------------------------------------------------------------
// Resolution Strategy
// -----------------------------------------------------------------------------

export enum ResolutionStrategy {
  LatestTagged = 'latest_tagged',
  SpecificVersion = 'specific_version',
  SpecificSnapshot = 'specific_snapshot',
}

export type ResolutionStrategyType =
  | ResolutionStrategy.LatestTagged
  | ResolutionStrategy.SpecificVersion
  | ResolutionStrategy.SpecificSnapshot;

export const RESOLUTION_STRATEGY_OPTIONS: ResolutionStrategyType[] =
  Object.values(ResolutionStrategy) as ResolutionStrategyType[];

// -----------------------------------------------------------------------------
// Snapshot Schedule Modes
// -----------------------------------------------------------------------------

export enum SnapshotScheduleMode {
  Manual = 'manual',
  Cron = 'cron',
  Dates = 'dates',
}

export type SnapshotScheduleModeType =
  | SnapshotScheduleMode.Manual
  | SnapshotScheduleMode.Cron
  | SnapshotScheduleMode.Dates;

export const SNAPSHOT_MODE_OPTIONS: SnapshotScheduleModeType[] = Object.values(
  SnapshotScheduleMode
) as SnapshotScheduleModeType[];

// -----------------------------------------------------------------------------
// Member Sync
// -----------------------------------------------------------------------------

export enum MemberSyncStrategy {
  TrackLatest = 'track_latest',
  Manual = 'manual',
}

export type MemberSyncStrategyType =
  | MemberSyncStrategy.TrackLatest
  | MemberSyncStrategy.Manual;

export const MEMBER_SYNC_STRATEGY_OPTIONS: MemberSyncStrategyType[] =
  Object.values(MemberSyncStrategy) as MemberSyncStrategyType[];

export enum MemberSyncBehavior {
  Replace = 'replace',
  Queue = 'queue',
  Ignore = 'ignore',
}

export type MemberSyncBehaviorType =
  | MemberSyncBehavior.Replace
  | MemberSyncBehavior.Queue
  | MemberSyncBehavior.Ignore;

export const MEMBER_SYNC_BEHAVIOR_OPTIONS: MemberSyncBehaviorType[] =
  Object.values(MemberSyncBehavior) as MemberSyncBehaviorType[];

export enum MemberSyncPolicy {
  Reset = 'reset',
  Preserve = 'preserve',
}

export type MemberSyncPolicyType =
  | MemberSyncPolicy.Reset
  | MemberSyncPolicy.Preserve;

export const MEMBER_SYNC_STATUS_POLICY_OPTIONS: MemberSyncPolicyType[] =
  Object.values(MemberSyncPolicy) as MemberSyncPolicyType[];
