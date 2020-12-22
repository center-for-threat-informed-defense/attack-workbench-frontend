import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CollectionIndex } from 'src/app/classes/collection-index';

@Component({
  selector: 'app-collection-index-import',
  templateUrl: './collection-index-import.component.html',
  styleUrls: ['./collection-index-import.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionIndexImportComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<CollectionIndexImportComponent>) { }

    ngOnInit(): void {
    }

    public url: string = "";

    public index: CollectionIndex = null;

    /**
     * download the collection index at this.url and move to the next step in the stepper
     */
    public download(): void {
        // TODO interact with collection manager to trigger download process
    }

}