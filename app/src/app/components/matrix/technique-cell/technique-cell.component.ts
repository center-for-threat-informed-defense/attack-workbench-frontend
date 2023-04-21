import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Technique } from 'src/app/classes/stix/technique';
import { ViewModelsService } from 'src/app/services/viewmodels.service';
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


  constructor(public viewModelsService: ViewModelsService) {
    super()
  }
  public get showTooltip(): boolean {
    if (this.showContextMenu) return false;
    if (this.isHighlighted) return true;
    return false
  }

  ngOnInit() {

  }

  public getClass(): string {
    let theclass = super.getClass();
    return theclass
  }
  public onLeftClick(event) {
    console.log("technique left click");
    this.leftclick.emit({
      "technique": this.technique,
    })
    return false;
  }
  public onRightClick(event) {
    // event.preventDefault(); // prevent browser default context menu
    // this.showContextMenu = true;
  }
  public onMouseEnter() {
    // this.highlight.emit();
  }
  public onMouseLeave() {
    // this.unhighlight.emit();
  }
  public closeContextMenu() {
    this.showContextMenu = false;
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
