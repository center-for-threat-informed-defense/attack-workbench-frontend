import { Component, OnInit } from '@angular/core';
import * as globals from '../../utils/globals';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: false,
})
export class FooterComponent implements OnInit {
  public appVersion: string = globals.appVersion;
  public appName: string = globals.appName;

  constructor() {
    // intentionally left blank
  }

  ngOnInit() {
    // intentionally left blank
  }
}
