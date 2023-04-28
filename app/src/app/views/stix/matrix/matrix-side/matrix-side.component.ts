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
export class MatrixSideComponent implements OnInit {
  @Input() public config: MatrixBaseConfig;

  private _idToLabel: Map<string, string>;
  public data$: Observable<Paginated<StixObject>>;
  public showID = false;
  public tacticList = [];

  public matrixMap: Map<string, Technique[]>;
  constructor() {
    }

  ngOnInit() {
    this.matrixMap = this.config.matrixMap;
    this.tacticList = this.config.tacticList;
  }
  public onToggleSubtechniquesVisible(technique: Technique) {
    technique.show_subtechniques = !technique.show_subtechniques;
  }


/**
 * Get a human readable label for the given object
 *
 * @param {string} stixID the stix ID to get
 */
public getLabel(stixID: string): string {
  if (!this._idToLabel) {
      this._idToLabel = new Map();
      for (let object of this.tacticList) {
          this._idToLabel.set(object.stixID, object[this.config.field]);
      }
    }
    return this._idToLabel.get(stixID);
  }
  hideDisabled: boolean = false; //are disabled techniques hidden?

  getTactic(id: string): Tactic {
    this.tacticList.forEach((item)=> {
      if(item.attackID == id || item.stixID == id) {
        return item;
      }
    })
    return null;
  }
}


export interface MatrixBaseConfig {
  matrixMap: Map<string, Technique[]>;
  field: string;
  tacticList: Tactic[];
}
