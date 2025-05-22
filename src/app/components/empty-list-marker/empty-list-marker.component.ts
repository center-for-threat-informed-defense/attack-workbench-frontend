import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-empty-list-marker',
  templateUrl: './empty-list-marker.component.html',
  styleUrls: ['./empty-list-marker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class EmptyListMarkerComponent implements OnInit {
  @Input() public message = 'Nothing here';
  @Input() public checkAgain = true;
  @Output() onCheckAgain = new EventEmitter();

  constructor() {
    // intentionally left blank
  }

  ngOnInit(): void {
    // intentionally left blank
  }
}
