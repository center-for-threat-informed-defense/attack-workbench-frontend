import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
    selector: 'app-markdown-view-dialog',
    templateUrl: './markdown-view-dialog.component.html',
    styleUrls: ['./markdown-view-dialog.component.scss']
})
export class MarkdownViewDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<MarkdownViewDialogComponent>, @Inject(MAT_DIALOG_DATA) public config: MarkownViewDialogConfig) { }

    ngOnInit(): void {
        // intentionally left blank
    }

}

export interface MarkownViewDialogConfig {
    markdown: string; //markdown to render
    title?: string; //optional title of the dialog
}