import { Component, OnInit } from '@angular/core';
import { Tactic } from 'src/app/classes/stix/tactic';
import { TacticService } from 'src/app/services/stix/tactic/tactic.service';

@Component({
  selector: 'app-tactic-list',
  templateUrl: './tactic-list.component.html',
  styleUrls: ['./tactic-list.component.scss']
})
export class TacticListComponent implements OnInit {

    public tactics: Tactic[] = [];

    constructor(private tacticService: TacticService) { }

    ngOnInit() {
        this.tactics = this.tacticService.getAll();
    }
}
