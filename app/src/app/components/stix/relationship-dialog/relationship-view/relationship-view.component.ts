import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { RelationshipDialogConfig } from '../relationship-dialog.component';

@Component({
  selector: 'app-relationship-view',
  templateUrl: './relationship-view.component.html',
  styleUrls: ['./relationship-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RelationshipViewComponent implements OnInit {
    @Input() public config: RelationshipDialogConfig;

    constructor() { }

    ngOnInit(): void {
    }

}
