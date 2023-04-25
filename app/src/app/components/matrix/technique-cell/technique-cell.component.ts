import { Component, Input, Output, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Technique } from 'src/app/classes/stix/technique';
import { ViewModelsService } from 'src/app/services/viewmodels.service';
import { Cell } from '../cell';

@Component({
  selector: 'app-technique-cell',
  templateUrl: './technique-cell.component.html',
  styleUrls: ['./technique-cell.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TechniqueCellComponent extends Cell implements OnInit {
  @Input() technique: Technique;
  @Input() showID: boolean;
  @Input() showName: boolean;
  @Output() highlight = new EventEmitter<any>(); // emit with the highlighted technique, or null to unhighlight
  @Output() unhighlight = new EventEmitter<any>();


  constructor(public viewModelsService: ViewModelsService) {
    super()
  }
  public get showTooltip(): boolean {
    if (this.isHighlighted) return true;
    return false
  }

  ngOnInit() {

  }

  public getClass(): string {
    let theclass = super.getClass();
    return theclass
  }
  public onLeftClick() {
    window.open("technique/"+this.technique.stixID)
    return false;
  }
  public onMouseEnter() {
  }
  public onMouseLeave() {
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
