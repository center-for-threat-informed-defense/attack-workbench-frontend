import { Component, OnInit } from '@angular/core';
import { MarkingDefinition } from 'src/app/classes/stix/marking-definition';
import { StixViewPage } from '../../stix-view-page';
import { MatDialog } from '@angular/material/dialog';
import { StixDialogComponent } from '../../stix-dialog/stix-dialog.component';

@Component({
    selector: 'app-marking-definition-view',
    templateUrl: './marking-definition-view.component.html',
    styleUrls: ['./marking-definition-view.component.scss']
})
export class MarkingDefinitionViewComponent extends StixViewPage implements OnInit {
    public get marking_definition(): MarkingDefinition { return this.config.object as MarkingDefinition; }

    constructor(public dialog: MatDialog) { super(); }

    ngOnInit(): void {
    }
}
