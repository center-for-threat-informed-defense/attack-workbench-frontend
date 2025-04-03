import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CollectionIndex } from 'src/app/classes/collection-index';
import * as moment from 'moment';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-collection-index-list',
  templateUrl: './collection-index-list.component.html',
  styleUrls: ['./collection-index-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CollectionIndexListComponent implements OnInit {
  constructor(private restAPIConnector: RestApiConnectorService) {}

  public collectionIndexes$: Observable<CollectionIndex[]>;
  public subscribed_collections = [];

  ngOnInit(): void {
    this.refreshIndexes();
    const subscription = this.restAPIConnector.getAllCollections({ versions: 'all' }).subscribe({
      next: (results) => {
        for (const collection of results.data) {
          this.subscribed_collections.push(`${collection.stixID}@${collection.modified}`);
        }
      },
      complete: () => {
        subscription.unsubscribe();
      },
    });
  }

  public refreshIndexes() {
    this.collectionIndexes$ = this.restAPIConnector.getCollectionIndexes();
  }

  /**
   * Is a given date "new" enough to warrant marking?
   * @param {Date} thedate the date in question
   * @returns {boolean} true if the date is "new" enough to be marked as such
   */
  public isNew(thedate: Date): boolean {
    const now = moment();
    const then = moment(thedate);
    const difference = moment.duration(then.diff(now));
    return difference.asWeeks() > -1;
  }
}
