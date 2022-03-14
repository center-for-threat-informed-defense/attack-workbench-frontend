import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { AttackIDPropertyConfig } from '../attackid-property.component';

@Component({
  selector: 'app-attackid-edit',
  templateUrl: './attackid-edit.component.html',
  styleUrls: ['./attackid-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AttackIDEditComponent implements OnInit {
  @Input() public config: AttackIDPropertyConfig;
  public prefix: string = '';

  constructor() {}

  ngOnInit(): void {}

  getPrefix(attackID) {
    if (attackID.split('-').length > 1) {
      this.prefix = attackID.split('-')[0]
      return this.prefix;
    }
    return ''
  }

  getEditable(attackID) {
    if (attackID.split('-').length > 1)
      return attackID.split('-')[1]
    return attackID
  }
}
