import { Component, Input, OnInit } from '@angular/core';
import { StatementPropertyConfig } from '../statement-property.component';
import { MarkingDefinition } from 'src/app/classes/stix';

@Component({
  selector: 'app-statement-diff',
  templateUrl: './statement-diff.component.html',
  styleUrl: './statement-diff.component.scss',
  standalone: false,
})
export class StatementDiffComponent implements OnInit {
  @Input() public statementsMap: any;
  @Input() public config: StatementPropertyConfig;

  public statementDiffList: any[] = [];
  public showChangeIndicator = false;

  public get current() {
    const statements: any[] =
      this.config.object[0]?.['object_marking_refs'] || [];
    // ignore tlp markings
    return statements.filter(id => this.statementsMap[id]);
  }
  public get previous() {
    const statements: any[] =
      this.config.object[1]?.['object_marking_refs'] || [];
    // ignore tlp markings
    return statements.filter(id => this.statementsMap[id]);
  }

  // return false if object has a statements
  public get popoverDisabled() {
    if (this.current.length > 0 || this.previous.length > 0) return false;
    return true;
  }

  public get popoverTrigger() {
    if (this.current.length > 0 || this.previous.length > 0) return 'hover';
    return 'none';
  }

  ngOnInit(): void {
    this.statementDiffList = this.mergeStatements();
    this.showChangeIndicator = this.changed();
  }

  private changed(): boolean {
    if (this.current.length !== this.previous.length) return false;

    const sortedCurrent = this.current.slice().sort();
    const sortedPrevious = this.previous.slice().sort();
    for (let i = 0; i < sortedCurrent.length; i++) {
      if (sortedCurrent[i] !== sortedPrevious[i]) return false;
    }
    return true;
  }

  private mergeStatements() {
    const merged = new Map();

    // add before state to map
    this.previous.forEach(stixId => {
      merged.set(stixId, {
        before: this.statementsMap[stixId] || null,
        after: null,
      });
    });

    // add after state to map
    for (const stixId of this.current) {
      if (merged.has(stixId))
        merged.get(stixId).after = this.statementsMap[stixId] || null;
      else
        merged.set(stixId, {
          before: null,
          after: this.statementsMap[stixId] || null,
        });
    }

    return Array.from(merged.values());
  }

  public getDefinition(statement: MarkingDefinition) {
    return statement?.definition_string || '';
  }

  public getLabel(statements: string[]): string {
    // use current object statement length to determine if 'statement' should be plural
    return `${statements.length} statement${this.current.length == 1 ? '' : 's'}`;
  }
}
