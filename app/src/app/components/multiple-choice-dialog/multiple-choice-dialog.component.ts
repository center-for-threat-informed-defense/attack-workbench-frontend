import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
    selector: 'app-multiple-choice-dialog',
    templateUrl: './multiple-choice-dialog.component.html',
    styleUrls: ['./multiple-choice-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MultipleChoiceDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<MultipleChoiceDialogComponent>, @Inject(MAT_DIALOG_DATA) public config: MultipleChoiceDialogConfig) { }

    ngOnInit(): void {
        // intentionally left blank
    }

}

export interface MultipleChoiceDialogConfig {
    title: string; //prompt text
    description?: string; //additional explanation
    choices: {
        label: string;
        description?: string;
    }[]
}