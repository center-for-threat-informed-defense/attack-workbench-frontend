import { Component, Input, OnInit } from '@angular/core';
import { StatementPropertyConfig } from '../statement-property.component';

@Component({
  selector: 'app-statement-view',
  templateUrl: './statement-view.component.html'
})
export class StatementViewComponent implements OnInit {
  @Input() public objStatements: any[];
  @Input() public config: StatementPropertyConfig;

  // return false if object has a statements 
  public get popoverDisabled() {
    if (this.objStatements.length > 0) return false;
    return true;
  }

  constructor() {
      // empty constructor
  }

  ngOnInit(): void {
      // empty on init
  }

}
