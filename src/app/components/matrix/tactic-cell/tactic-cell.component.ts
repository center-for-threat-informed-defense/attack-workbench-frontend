import { Component, Input, OnInit } from '@angular/core';
import { Tactic } from 'src/app/classes/stix/tactic';

@Component({
  selector: 'app-tactic-cell',
  templateUrl: './tactic-cell.component.html',
  styleUrls: ['./tactic-cell.component.scss'],
})
export class TacticCellComponent implements OnInit {
  @Input() tactic: Tactic;
  @Input() showID: boolean;

  constructor() {
    // intentionally blank
  }

  ngOnInit() {
    //intentionally blank
  }

  viewTactic() {
    window.open('tactic/' + this.tactic.stixID);
  }
}
