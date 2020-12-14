import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CollectionIndex, exampleCollectionIndexes} from 'src/app/classes/collection-index';
import * as moment from 'moment';

@Component({
  selector: 'app-collection-index-list',
  templateUrl: './collection-index-list.component.html',
  styleUrls: ['./collection-index-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionIndexListComponent implements OnInit {
    // public collectionIndexes: CollectionIndex[] = [exampleCollectionIndex]
    public get exampleCollectionIndexes() { return exampleCollectionIndexes; }
    constructor() { }

    ngOnInit(): void {
    }

    /**
     * Is a given date "new" enough to warrant marking?
     * @param {Date} thedate the date in questino
     * @returns {boolean} true if the date is "new" enough to be marked as such
     */
    public isNew(thedate: Date): boolean {
        let now = moment();
        let then = moment(thedate);
        let difference = moment.duration(then.diff(now));
        return difference.asWeeks() > -1;
    }

}
