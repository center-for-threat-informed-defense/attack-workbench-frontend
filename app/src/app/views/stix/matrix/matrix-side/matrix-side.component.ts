import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Matrix } from 'src/app/classes/stix/matrix';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { Paginated } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-matrix-side',
  templateUrl: './matrix-side.component.html',
  styleUrls: ['./matrix-side.component.scss']
})
export class MatrixSideComponent {
  @Input() public matrix: Matrix;

  private _idToLabel: Map<string, string>;
  public data$: Observable<Paginated<StixObject>>;
  public showID = false;

  constructor() {
    }

  public onToggleSubtechniquesVisible(technique: Technique) {
    technique.show_subtechniques = !technique.show_subtechniques;
  }
}
