import { Component, OnInit, Input } from '@angular/core';
import { AttackIDPropertyConfig } from '../attackid-property.component';

@Component({
  selector: 'app-attackid-edit',
  templateUrl: './attackid-edit.component.html',
  styleUrls: ['./attackid-edit.component.scss']
})
export class AttackIDEditComponent implements OnInit {
  @Input() public config: AttackIDPropertyConfig;

  constructor() { }

  ngOnInit(): void {
  }

}
