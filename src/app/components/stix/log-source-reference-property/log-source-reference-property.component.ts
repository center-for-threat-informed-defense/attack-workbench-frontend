import { Component, Input } from '@angular/core';
import { StixObject } from 'src/app/classes/stix';

@Component({
  selector: 'app-log-source-reference-property',
  templateUrl: './log-source-reference-property.component.html',
  standalone: false,
})
export class LogSourceReferencePropertyComponent {
  @Input() public config: LogSourceReferencePropertyConfig;
}

export interface LogSourceReferencePropertyConfig {
  /** What is the current mode? Default: 'view' */
  mode?: 'view' | 'edit' | 'diff';
  /** The object to show the field of */
  object: StixObject | [StixObject, StixObject];
}
