import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { OrderedListPropertyConfig } from '../ordered-list-property.component';

@Component({
  selector: 'app-ordered-list-view',
  templateUrl: './ordered-list-view.component.html',
  styleUrls: ['./ordered-list-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderedListViewComponent implements OnInit {
  @Input() public config: OrderedListPropertyConfig;

  constructor() { }

  ngOnInit(): void {
  }

}
