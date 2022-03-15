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
    const objectRegex = this.config.object['attackIDValidator']?.format;
    const typePrefix = objectRegex ? (objectRegex.includes('#') ? objectRegex.split('#')[0] : '') : ''
    const prefixRegex = new RegExp("^([A-Z]+-)?" + typePrefix);
    const prefixMatch = attackID.match(prefixRegex);

    if (prefixMatch?.length > 0) {
      this.prefix = prefixMatch[0];
      return this.prefix;
    }
    return ''
  }

  getEditable(attackID) {
    if (this.prefix && attackID.split(this.prefix).length > 1)
      return attackID.split(this.prefix)[1]
    return attackID
  }
}
