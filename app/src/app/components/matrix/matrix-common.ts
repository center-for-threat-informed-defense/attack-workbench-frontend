import { Directive, Input } from '@angular/core';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { ViewModel, ViewModelsService } from 'src/app/services/viewmodels.service';

@Directive({ selector: '[selector-name]' })
export abstract class MatrixCommon {
  @Input() matrix: Matrix
  @Input() viewModel: ViewModel;

  constructor(public viewModelsService: ViewModelsService) {
   }

  public onTechniqueLeftClick(event: any, technique: Technique, tactic: Tactic) {
    console.log("on technique left click: ", technique)
  }
  public onTechniqueRightClick(event: any, technique: Technique, tactic: Tactic) {
    console.log("on technique right click: ", technique)
  }
  public onTechniqueHighlight(event: any, technique: Technique, tactic: Tactic) {
    this.viewModel.highlightTechnique(technique, tactic)
  }
  public onTechniqueUnhighlight(event: any) {
    this.viewModel.clearHighlight();

  }
  public onTacticClick(tactic: Tactic) {
    console.log(" on tactic click ", tactic);

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

}

/**
 * Object representing an ATT&CK matrix (x-mitre-matrix)
 */
export class Matrix  {
  public readonly tactics: Tactic[]; //tactics found under this Matrix
  public readonly id: string;          // STIX ID
  public readonly attackID: string;    // ATT&CK ID
  public readonly name: string;        // name of object
  public readonly description: string; // description of object
  public readonly url: string;         // URL of object on the ATT&CK website
  public readonly created: string;     // date object was created
  public readonly modified: string;    // date object was last modified
  public readonly revoked: boolean;    // is the object revoked?
  public readonly deprecated: boolean; // is the object deprecated?
  public readonly version: string;     // object version
  /**
   * Creates an instance of Matrix.
   * @param {*} stixSDO for the matrix
   * @param {Map<string, any>} idToTacticSDO map of tactic ID to tactic SDO
   * @param {Technique[]} techniques all techniques defined in the domain
   */
  constructor() {

  }
}
