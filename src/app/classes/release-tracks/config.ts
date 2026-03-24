// -----------------------------------------------------------------------------
// Release Track Configuration
// -----------------------------------------------------------------------------

import {
  ConflictPolicyType,
  WorkflowStatusType,
  MemberSyncBehaviorType,
  MemberSyncPolicyType,
  MemberSyncStrategyType,
} from './enums';

export interface PromotionConflicts {
  candidates_to_staged?: ConflictPolicyType;
  staged_to_members?: ConflictPolicyType;
}

export interface IncludeSecondaryObjects {
  enabled?: boolean;
  status_threshold?: WorkflowStatusType;
}

export interface MemberSyncSupplant {
  behavior?: MemberSyncBehaviorType;
  status_policy?: MemberSyncPolicyType;
}

export interface MemberSync {
  strategy?: MemberSyncStrategyType;
  supplant?: MemberSyncSupplant;
}

export interface ReleaseTrackConfig {
  candidacy_threshold?: WorkflowStatusType;
  auto_promote?: boolean;
  include_secondary_objects?: IncludeSecondaryObjects;
  promotion_conflicts?: PromotionConflicts;
  member_sync?: MemberSync;
}
