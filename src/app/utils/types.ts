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
  | 'data-component';

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
  | 'x-mitre-data-component';

/**
 * Workflow state definitions
 */
export type WorkflowState =
  | ''
  | 'work-in-progress'
  | 'awaiting-review'
  | 'reviewed';

/**
 * List of all workflow states
 */
export const WorkflowStates: Record<WorkflowState, string> = {
  '': 'none',
  'work-in-progress': 'work in progress',
  'awaiting-review': 'awaiting review',
  'reviewed': 'reviewed',
};
