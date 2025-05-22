import { Component, Input, OnInit } from '@angular/core';
import { VersionPropertyConfig } from '../version-property.component';

@Component({
  selector: 'app-version-view',
  templateUrl: './version-view.component.html',
  styleUrls: ['./version-view.component.scss'],
  standalone: false,
})
export class VersionViewComponent implements OnInit {
  @Input() public config: VersionPropertyConfig;

  constructor() {
    // intentionally left blank
  }

  ngOnInit(): void {
    // intentionally left blank
  }
}
