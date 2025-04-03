import { Component, Input } from '@angular/core';
import { StatementPropertyConfig } from '../statement-property.component';

@Component({
  selector: 'app-statement-view',
  templateUrl: './statement-view.component.html',
})
export class StatementViewComponent {
  @Input() public statementsMap: any;
  @Input() public config: StatementPropertyConfig;

  public get object() {
    return Array.isArray(this.config.object)
      ? this.config.object[0]
      : this.config.object;
  }

  // return false if object has a statements
  public get popoverDisabled() {
    if (this.objStatements.length > 0) return false;
    return true;
  }

  public get popoverTrigger() {
    if (this.objStatements.length > 0) return 'hover';
    return 'none';
  }

  // Retrieves statements of current Object
  public get objStatements(): any[] {
    const objectStatements = [];
    if (this.object['object_marking_refs']) {
      for (const stixId of this.object['object_marking_refs']) {
        if (this.statementsMap[stixId])
          objectStatements.push(this.statementsMap[stixId]);
      }
    }
    return objectStatements;
  }
}
