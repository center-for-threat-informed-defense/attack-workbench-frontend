import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CollectionIndexImportComponent } from '../collection-index/collection-index-import/collection-index-import.component';

@Component({
  selector: 'app-collection-manager',
  templateUrl: './collection-manager.component.html',
  styleUrls: ['./collection-manager.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionManagerComponent implements OnInit {

    constructor(public dialog: MatDialog) { }

    ngOnInit(): void {
    }

    public openIndexImport() {
        this.dialog.open(CollectionIndexImportComponent, {
            maxHeight: "75vh"
        });
    }

}
