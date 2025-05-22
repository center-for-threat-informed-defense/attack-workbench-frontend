import { Component, Input } from '@angular/core';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';

@Component({
  selector: 'app-matrix-flat',
  templateUrl: './matrix-flat.component.html',
  styleUrls: ['./matrix-flat.component.scss'],
  standalone: false,
})
export class MatrixFlatComponent {
  @Input() public tactics: Tactic[];

  public showID = false;

  constructor() {
    // intentionally blank
  }

  public onToggleSubtechniquesVisible(technique: Technique) {
    technique.show_subtechniques = !technique.show_subtechniques;
  }
}
