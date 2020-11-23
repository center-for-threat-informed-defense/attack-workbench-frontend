import { Component, Input, OnInit } from '@angular/core';
import { TimestampPropertyConfig } from '../timestamp-property.component';

@Component({
  selector: 'app-timestamp-diff',
  templateUrl: './timestamp-diff.component.html',
  styleUrls: ['./timestamp-diff.component.scss']
})
export class TimestampDiffComponent implements OnInit {
    @Input() public config: TimestampPropertyConfig;

    constructor() { }

    ngOnInit(): void {
    }


}
