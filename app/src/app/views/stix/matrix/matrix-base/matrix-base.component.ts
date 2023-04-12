import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StixObject } from 'src/app/classes/stix/stix-object';
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
  public showID = true;

  public matrixDetails: any;
  public matrixMap: Map<string, Technique[]>;
  constructor(
    private restAPIConnectorService: RestApiConnectorService,
    ) { }

  ngOnInit() {
    this.matrixMap = new Map<string, Technique[]>();
    this.config.tacticList.forEach((tactic) => {
      let itemsCopy;
      let subscription = this.restAPIConnectorService.getTechniquesInTactic(tactic.stixID, tactic.modified).subscribe({
        next: (items) => {
          itemsCopy = items
          this.matrixMap.set(tactic.stixID, itemsCopy)
        },
        complete: () => {
          subscription.unsubscribe();
        }
      })

    })

  }

    /**
     * Get a human readable label for the given object
     *
     * @param {string} stixID the stix ID to get
     */
    public getLabel(stixID: string): string {
      if (!this._idToLabel) {
          this._idToLabel = new Map();
          for (let object of this.config.tacticList) {
              this._idToLabel.set(object.stixID, object[this.config.field]);
          }
      }
      return this._idToLabel.get(stixID);
  }
  hideDisabled: boolean = false; //are disabled techniques hidden?
}


export interface MatrixBaseConfig {
  field: string;
  tacticList: StixObject[];
}
