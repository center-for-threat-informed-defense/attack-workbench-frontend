import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Matrix } from 'src/app/classes/stix/matrix';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { FilterGroup } from 'src/app/components/stix/stix-list/stix-list.component';
import { Paginated, RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-matrix-base',
  templateUrl: './matrix-base.component.html',
  styleUrls: ['./matrix-base.component.scss']
})
export class MatrixBaseComponent implements OnInit {
  @Input() public config: MatrixBaseConfig;

  private _idToLabel: Map<string, string>;
  public data$: Observable<Paginated<StixObject>>;
  public filterOptions: FilterGroup[] = [];
  public searchQuery: string = "";
  public filter: string[] = [];
  public totalObjectCount: number = 0;
  public showID = false;
  public tacticList = [];

  public matrixDetails: any;
  public matrixMap: Map<string, Technique[]>;
  constructor(
    private restAPIConnectorService: RestApiConnectorService
    ) {
    }

  ngOnInit() {
    this.matrixMap = new Map<string, Technique[]>();
    // order list of tactics to match ATT&Ck website
    this.config.object.tactic_refs.forEach(item => {
      this.tacticList.push(this.config.tacticList.find(e => e.stixID === item))
    });
    this.tacticList.forEach((tactic) => {
      let itemsCopy;
      let subscription = this.restAPIConnectorService.getTechniquesInTactic(tactic.stixID, tactic.modified).subscribe({
        next: (items) => {
          // alphabetically order subtechniques
          itemsCopy = items.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
          this.matrixMap.set(tactic.stixID, itemsCopy)
        },
        complete: () => {
          subscription.unsubscribe();
        }
      })

    })
  }
  // complete logic once api call is done
  public onToggleSubtechniquesVisible(technique: Technique, tactic: Tactic) {
    console.log("toggling visibility for ", technique);
    technique.show_subtechniques = !technique.show_subtechniques;
    // if (technique.subtechniques.length == 0) return;
    // let tvm = this.viewModel.getTechniqueVM(technique, tactic);
    // console.log("tvm: ", tvm)
    // tvm.showSubtechniques = !tvm.showSubtechniques;
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
  field: string;
  tacticList: Tactic[];
  object: Matrix;
}
