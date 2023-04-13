import { Component, OnInit, Input, ElementRef, ViewEncapsulation } from '@angular/core';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { ViewModel } from 'src/app/services/viewmodels.service';
import { CellPopover } from '../cell-popover';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TooltipComponent extends CellPopover implements OnInit {
  @Input() technique: Technique;
  @Input() tactic: Tactic;
  @Input() viewModel: ViewModel;
  public placement: string;
  public notes: Note[];

  public get isCellPinned(): boolean {
    return true;
  }

  constructor(private element: ElementRef) {
    super(element)
  }

  ngOnInit() {
    this.placement = this.getPosition();
  }

}
export class Note {
  public readonly abstract?: string; // brief summary of note content
  public readonly content: string; // content of the note
  public readonly object_refs: string[]; // list of STIX objects the note is applied to

  /**
   * Creates an instance of Note.
   * @param {*} stixSDO for the note
  */
  constructor(stixSDO: any) {
      if (stixSDO.abstract) this.abstract = stixSDO.abstract;
      this.content = stixSDO.content;
      this.object_refs = stixSDO.object_refs;
  }
}
