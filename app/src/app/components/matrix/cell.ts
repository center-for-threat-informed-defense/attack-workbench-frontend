import { Directive, Input } from "@angular/core";
import { Tactic } from "src/app/classes/stix/tactic";
import { Technique } from "src/app/classes/stix/technique";
import { ViewModel } from "src/app/services/viewmodels.service";

@Directive()
export abstract class Cell {
  @Input() viewModel: ViewModel;
  @Input() technique: Technique;
  @Input() tactic: Tactic;

  public showContextMenu: boolean = false;
  isDarkTheme: boolean;

  constructor() {}

  public get isHighlighted(): boolean {
    let isHighlighted = this.showContextMenu;
    let idToMatch = this.technique.attackID;
    // lookup linked techniques and highlight all techniques with same ID
    if (this.viewModel && this.viewModel.highlightedTechniques && this.viewModel.highlightedTechniques.has(idToMatch))  {
      return true;
    }
    return isHighlighted;
  }

  public getClass(): string {
    let theclass = 'link noselect cell'
    if (this.isHighlighted) {
      theclass += ' highlight'
    }
    return theclass;
  }
}
