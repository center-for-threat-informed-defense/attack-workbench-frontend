import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Matrix } from 'src/app/classes/stix/matrix';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { MatrixBaseConfig } from '../matrix-side/matrix-side.component';
import { FilterGroup } from 'src/app/components/stix/stix-list/stix-list.component';
import { Paginated, RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
@Component({
  selector: 'app-matrix-flat',
  templateUrl: './matrix-flat.component.html',
  styleUrls: ['./matrix-flat.component.scss']
})
export class MatrixFlatComponent implements OnInit {
  @Input() public config: MatrixBaseConfig;

  private _idToLabel: Map<string, string>;
  public data$: Observable<Paginated<StixObject>>;
  public showID = false;
  public tacticList = [];
  public matrixMap: Map<string, Technique[]>;

  constructor() { }

  ngOnInit() {
    this.matrixMap = this.config.matrixMap;
    this.tacticList = this.config.tacticList;
    console.log("matrix map ", this.matrixMap);
    console.log("tactic list ", this.tacticList);

  }
  public onToggleSubtechniquesVisible(technique: Technique) {
    technique.show_subtechniques = !technique.show_subtechniques;
  }
  getTactic(id: string): Tactic {
    this.tacticList.forEach((item)=> {
      if(item.attackID == id || item.stixID == id) {
        return item;
      }
    })
    return null;
  }
}
