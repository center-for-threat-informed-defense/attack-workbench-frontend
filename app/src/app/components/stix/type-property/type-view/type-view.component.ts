import { Component, Input, OnInit } from '@angular/core';
import { TypePropertyConfig } from '../type-property.component';

@Component({
  selector: 'app-type-view',
  templateUrl: './type-view.component.html',
  styleUrls: ['./type-view.component.scss']
})
export class TypeViewComponent implements OnInit {
  @Input() public config: TypePropertyConfig;

  constructor() { }

  ngOnInit(): void {
  }

}
