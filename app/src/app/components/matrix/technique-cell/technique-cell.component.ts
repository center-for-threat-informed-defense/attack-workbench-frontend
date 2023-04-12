import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Technique } from 'src/app/classes/stix/technique';
import { Cell } from '../cell';

@Component({
  selector: 'app-technique-cell',
  templateUrl: './technique-cell.component.html',
  styleUrls: ['./technique-cell.component.scss']
})
export class TechniqueCellComponent extends Cell implements OnInit {
  @Input() technique: Technique;
  @Input() showID: boolean;
  @Input() showName: boolean;
  @Output() highlight = new EventEmitter<any>(); // emit with the highlighted technique, or null to unhighlight
  @Output() unhighlight = new EventEmitter<any>();
  @Output() leftclick = new EventEmitter<any>(); // emit with the selected technique and the modifier keys

  public showContextmenu: boolean = false;

  constructor() {
    super()
  }
  public get showTooltip(): boolean {
    if (this.showContextMenu) return false;

    return false
  }


  ngOnInit() {

  }
  public onLeftClick(event) {

  }
  public onRightClick(event) {
    this.showContextmenu = true;
  }
  public onMouseEnter() {
    this.highlight.emit();
  }
  public onMouseLeave() {
    this.unhighlight.emit();
  }
}

export class TechniqueEvent {
  public readonly event: Event;
  public readonly technique: Technique;
  constructor(event, technique) {
      this.technique = technique;
      this.event = event;
  }
}
