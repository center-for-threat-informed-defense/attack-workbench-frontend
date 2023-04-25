import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Technique } from 'src/app/classes/stix/technique';
import { Cell } from '../cell';

@Component({
  selector: 'app-technique-cell',
  templateUrl: './technique-cell.component.html',
  styleUrls: ['./technique-cell.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TechniqueCellComponent extends Cell implements OnInit {
  @Input() technique: Technique;
  @Input() showID: boolean;
  @Input() showName: boolean;

  constructor() {
    super()
  }

  ngOnInit() {

  }

  public onLeftClick() {
    window.open("technique/"+this.technique.stixID)
    return false;
  }
}
