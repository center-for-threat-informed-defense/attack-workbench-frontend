import { Directive, Input } from "@angular/core";
import { Tactic } from "src/app/classes/stix/tactic";
import { Technique } from "src/app/classes/stix/technique";

@Directive()
export abstract class Cell {
  @Input() technique: Technique;
  @Input() tactic: Tactic;

  public showContextMenu: boolean = false;
  isDarkTheme: boolean;

  constructor() {}

  public get isHighlighted(): boolean {
    let isHighlighted = this.showContextMenu;
    // let idToMatch = this.technique.id;

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
