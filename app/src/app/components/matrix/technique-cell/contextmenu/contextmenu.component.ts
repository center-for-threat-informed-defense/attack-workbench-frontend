import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewEncapsulation } from '@angular/core';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { CellPopover } from '../cell-popover';

@Component({
  selector: 'app-contextmenu',
  templateUrl: './contextmenu.component.html',
  styleUrls: ['./contextmenu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContextmenuComponent extends CellPopover implements OnInit {
  @Input() technique: Technique;
  @Input() tactic: Tactic;
  public placement: string;
  @Output() close = new EventEmitter<any>();
  constructor(private element: ElementRef) {
    super(element)
  }

  ngOnInit() {
    this.placement = this.getPosition();
  }

  public closeContextmenu() {
    console.log("CLOSE CONTEXT MENU");

    this.close.emit();
  }
  public select() {
    console.log("context menu select ");
    this.closeContextmenu();
    console.log("closed context menu ");

  }
  public addSelection() {
    this.closeContextmenu();
  }
  public removeSelection() {
    this.closeContextmenu();
  }
  public viewTechnique() {
    this.closeContextmenu();
    window.open("technique/"+this.technique.stixID)
  }
  public viewTactic() {
    this.closeContextmenu();
  }

}
