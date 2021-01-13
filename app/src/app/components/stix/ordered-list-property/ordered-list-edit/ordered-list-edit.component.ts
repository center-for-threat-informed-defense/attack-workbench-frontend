import { Component, Input, OnInit } from '@angular/core';
import { OrderedListPropertyConfig } from '../ordered-list-property.component';

@Component({
  selector: 'app-ordered-list-edit',
  templateUrl: './ordered-list-edit.component.html',
  styleUrls: ['./ordered-list-edit.component.scss']
})
export class OrderedListEditComponent implements OnInit {
  @Input() public config: OrderedListPropertyConfig;

  constructor() { }

  ngOnInit(): void {
  }

}
