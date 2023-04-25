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


  public getClass(): string {
    let theclass = 'link noselect cell'
    return theclass;
  }
}
