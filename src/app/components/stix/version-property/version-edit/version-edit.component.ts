import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { VersionPropertyConfig } from '../version-property.component';

@Component({
  selector: 'app-version-edit',
  templateUrl: './version-edit.component.html',
  styleUrls: ['./version-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VersionEditComponent implements OnInit {
  @Input() public config: VersionPropertyConfig;

  public version: string;
  public get field(): string {
    return this.config.field ? this.config.field : 'version';
  }

  constructor() {
    // intentionally left blank
  }

  ngOnInit(): void {
    this.version = this.config.object[this.field].version;
  }

  public setVersion(event: any): void {
    let newVersion = '';
    const value = event.target.valueAsNumber;
    if (value?.toString().split('.').length == 1) {
      // does not have decimal place, add it
      newVersion = value.toFixed(1);
    } else {
      // already has a decimal place, convert to string
      newVersion = value.toString();
    }
    this.version = newVersion;
    this.config.object[this.field].version = newVersion;
  }
}
