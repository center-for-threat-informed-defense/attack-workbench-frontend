import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Technique } from 'src/app/classes/stix/technique';

@Component({
  selector: 'app-technique-cell',
  templateUrl: './technique-cell.component.html',
  styleUrls: ['./technique-cell.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TechniqueCellComponent implements OnInit {
  @Input() technique: Technique;
  @Input() showID: boolean;
  @Input() showName: boolean;

  constructor() {
  }

  ngOnInit() {

  }

  public onLeftClick() {
    window.open("technique/"+this.technique.stixID)
    return false;
  }
}
