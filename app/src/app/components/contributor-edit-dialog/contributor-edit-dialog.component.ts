import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-contributor-edit-dialog',
    templateUrl: './contributor-edit-dialog.component.html',
    styleUrls: ['./contributor-edit-dialog.component.scss']
})
export class ContributorEditDialogComponent implements OnInit {
    public dirty: boolean;

    constructor() { }

    ngOnInit(): void { }
}
