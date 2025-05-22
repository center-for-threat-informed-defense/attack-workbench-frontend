import { Component, Input } from '@angular/core';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';

@Component({
  selector: 'app-matrix-side',
  templateUrl: './matrix-side.component.html',
  styleUrls: ['./matrix-side.component.scss'],
  standalone: false,
})
export class MatrixSideComponent {
  @Input() public tactics: Tactic[];

  public showID = false;

  constructor() {
    // intentionally left blank
  }

  public onToggleSubtechniquesVisible(technique: Technique) {
    technique.show_subtechniques = !technique.show_subtechniques;
  }
}
