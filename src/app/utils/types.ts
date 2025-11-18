/**
 * ATT&CK type definitions
 */
export type AttackType =
  | 'asset'
  | 'campaign'
  | 'collection'
  | 'group'
  | 'matrix'
  | 'mitigation'
  | 'software'
  | 'tactic'
  | 'technique'
  | 'relationship'
  | 'note'
  | 'identity'
  | 'marking-definition'
  | 'data-source'
  | 'data-component'
  | 'detection-strategy'
  | 'analytic';

/**
 * STIX type definitions
 */
export type StixType =
  | 'x-mitre-asset'
  | 'campaign'
  | 'x-mitre-collection'
  | 'intrusion-set'
  | 'x-mitre-matrix'
  | 'course-of-action'
  | 'malware'
  | 'tool'
  | 'x-mitre-tactic'
  | 'attack-pattern'
  | 'relationship'
  | 'note'
  | 'identity'
  | 'marking-definition'
  | 'x-mitre-data-source'
  | 'x-mitre-data-component'
  | 'x-mitre-detection-strategy'
  | 'x-mitre-analytic';

/**
 * Workflow state definitions
 */
export type WorkflowState =
  | 'work-in-progress'
  | 'awaiting-review'
  | 'reviewed';

/**
 * List of all workflow states
 */
export const WorkflowStates: Record<WorkflowState, string> = {
  'work-in-progress': 'work in progress',
  'awaiting-review': 'awaiting review',
  'reviewed': 'reviewed',
};

/**
 * Collection/release changelog categories
 */
export type ChangelogCategory =
  | 'additions'
  | 'changes'
  | 'minor_changes'
  | 'revocations'
  | 'deprecations';
