/**
 * This file contains mappings for ATT&CK/STIX types, strings, and other
 * lightweight transformations.
 *
 * Note: this file should not include mappings or references to class constructors.
 * Class constructor mappings should be defined in 'class-mappings.ts' to prevent
 * circular dependency issues.
 */

import { AttackType } from './types';

/**
 * Map ATT&CK types to their plural forms
 * @type { Record<AttackType, string> }
 */
export const AttackTypeToPlural: Record<AttackType, string> = {
  'technique': 'techniques',
  'tactic': 'tactics',
  'group': 'groups',
  'campaign': 'campaigns',
  'asset': 'assets',
  'software': 'software',
  'mitigation': 'mitigations',
  'matrix': 'matrices',
  'collection': 'collections',
  'relationship': 'relationships',
  'note': 'notes',
  'identity': 'identities',
  'marking-definition': 'marking-definitions',
  'data-source': 'data-sources',
  'data-component': 'data-components',
};

/**
 * Map ATT&CK types to their url path
 * @type { Record<AttackType, string> }
 */
export const AttackTypeToRoute: Record<AttackType, string> = AttackTypeToPlural;

/**
 * Map STIX types to their corresponding ATT&CK types
 * @type { Record<StixType, AttackType> }
 */
export const StixTypeToAttackType = {
  'x-mitre-collection': 'collection',
  'attack-pattern': 'technique',
  'malware': 'software',
  'tool': 'software',
  'intrusion-set': 'group',
  'campaign': 'campaign',
  'course-of-action': 'mitigation',
  'x-mitre-matrix': 'matrix',
  'x-mitre-tactic': 'tactic',
  'relationship': 'relationship',
  'marking-definition': 'marking-definition',
  'x-mitre-data-source': 'data-source',
  'x-mitre-data-component': 'data-component',
  'x-mitre-asset': 'asset',
  'note': 'note',
  'identity': 'identity',
};
