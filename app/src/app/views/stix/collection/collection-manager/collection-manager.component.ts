import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CollectionIndexImportComponent } from '../collection-index/collection-index-import/collection-index-import.component';
import { CollectionIndexListComponent } from '../collection-index/collection-index-list/collection-index-list.component';

@Component({
  selector: 'app-collection-manager',
  templateUrl: './collection-manager.component.html',
  styleUrls: ['./collection-manager.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionManagerComponent implements OnInit {
    @ViewChild(CollectionIndexListComponent) private collectionIndexList: CollectionIndexListComponent;

    constructor(public dialog: MatDialog) { }

    ngOnInit(): void {
    }

    public openIndexImport() {
        let importer = this.dialog.open(CollectionIndexImportComponent, {
            maxHeight: "75vh",
            width: "50em" //45 + 5 for padding
        });
        //trigger refresh of indexes after the user closes the importer
        importer.afterClosed().subscribe(() => this.collectionIndexList.refreshIndexes()); 
    }

}
