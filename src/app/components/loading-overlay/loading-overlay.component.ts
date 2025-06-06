import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class LoadingOverlayComponent implements OnInit {
  @Input() message = '';

  constructor() {
    // intentionally left blank
  }

  ngOnInit() {
    // intentionally left blank
  }
}
