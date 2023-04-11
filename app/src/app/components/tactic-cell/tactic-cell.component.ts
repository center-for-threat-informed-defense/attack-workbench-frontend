import { Component, Input, OnInit } from '@angular/core';
import { Tactic } from 'src/app/classes/stix/tactic';

@Component({
  selector: 'app-tactic-cell',
  templateUrl: './tactic-cell.component.html',
  styleUrls: ['./tactic-cell.component.css']
})
export class TacticCellComponent implements OnInit {
  @Input() tactic: Tactic;
  @Input() count: Number;
  public showId = false;

  constructor() { }

  ngOnInit() {
  }
}
