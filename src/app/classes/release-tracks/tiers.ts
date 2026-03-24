import { WorkflowStatusType } from './enums';

export interface MemberEntry {
  object_ref: string;
  object_modified: Date;
}

export interface StagedEntry {
  object_ref: string;
  object_modified: Date;
  object_status: WorkflowStatusType;
  object_staged_at: Date;
  object_staged_by: string;
}

export interface CandidateEntry {
  object_ref: string;
  object_modified: Date;
  object_status: WorkflowStatusType;
  object_added_at: Date;
  object_added_by: string;
}

export interface QuarantineEntry {
  object_ref: string;
  object_modified: Date;
  source_track_id: string;
  source_track_name: string;
  source_snapshot_version?: string | null;
  conflict_reason: string;
}
