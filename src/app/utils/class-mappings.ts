/**
 * This file contains mappings between ATT&CK/STIX types and their corresponding
 * class constructors.
 *
 * If additional mappings to classes are required, they should be added here to
 * maintain consistency and prevent circular dependency issues (some classes rely
 * on mappings defined in 'type-mappings.ts', and importing class constructors
 * there create a dependency loop).
 */

import {
  Technique,
  Tactic,
  Group,
  Campaign,
  Asset,
  Software,
  Mitigation,
  Matrix,
  Relationship,
  Note,
  Identity,
  MarkingDefinition,
  DataSource,
  DataComponent,
} from '../classes/stix';
import { Collection } from '../classes/stix/collection';
import { AttackType, StixType } from './types';

/**
 * ATT&CK class type definitions
 */
type AttackClass =
  | typeof Technique
  | typeof Tactic
  | typeof Group
  | typeof Campaign
  | typeof Asset
  | typeof Software
  | typeof Mitigation
  | typeof Matrix
  | typeof Collection
  | typeof Relationship
  | typeof Note
  | typeof Identity
  | typeof MarkingDefinition
  | typeof DataSource
  | typeof DataComponent;

/**
 * Map ATT&CK types to their corresponding classes
 * @type { Record<AttackType, any> }
 */
export const AttackTypeToClass: Record<AttackType, AttackClass> = {
  'technique': Technique,
  'tactic': Tactic,
  'group': Group,
  'campaign': Campaign,
  'asset': Asset,
  'software': Software,
  'mitigation': Mitigation,
  'matrix': Matrix,
  'collection': Collection,
  'relationship': Relationship,
  'note': Note,
  'identity': Identity,
  'marking-definition': MarkingDefinition,
  'data-source': DataSource,
  'data-component': DataComponent,
};

/**
 * Map STIX types to their corresponding classes
 * @type { Record<StixType, any> }
 */
export const StixTypeToClass: Record<StixType, AttackClass> = {
  'attack-pattern': Technique,
  'x-mitre-tactic': Tactic,
  'intrusion-set': Group,
  'campaign': Campaign,
  'x-mitre-asset': Asset,
  'tool': Software,
  'malware': Software,
  'course-of-action': Mitigation,
  'x-mitre-matrix': Matrix,
  'x-mitre-collection': Collection,
  'relationship': Relationship,
  'identity': Identity,
  'marking-definition': MarkingDefinition,
  'x-mitre-data-source': DataSource,
  'x-mitre-data-component': DataComponent,
  'note': Note,
};
