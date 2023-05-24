import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Matrix } from 'src/app/classes/stix/matrix';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { Technique } from 'src/app/classes/stix/technique';
import { Paginated } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
@Component({
  selector: 'app-matrix-flat',
  templateUrl: './matrix-flat.component.html',
  styleUrls: ['./matrix-flat.component.scss']
})
export class MatrixFlatComponent {
  @Input() public matrix: Matrix;

  private _idToLabel: Map<string, string>;
  public data$: Observable<Paginated<StixObject>>;
  public showID = false;

  constructor() {
    //intentionally blank
  }

  public onToggleSubtechniquesVisible(technique: Technique) {
    technique.show_subtechniques = !technique.show_subtechniques;
  }
}
