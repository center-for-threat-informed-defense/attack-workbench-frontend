import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Role } from 'src/app/classes/authn/role';
import {
  CollectionIndex,
  CollectionReference,
  CollectionVersion,
} from 'src/app/classes/collection-index';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { MarkdownViewDialogComponent } from 'src/app/components/markdown-view-dialog/markdown-view-dialog.component';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-collection-index-view',
  templateUrl: './collection-index-view.component.html',
  styleUrls: ['./collection-index-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class CollectionIndexViewComponent implements OnInit {
  @Input() config: CollectionIndexViewConfig;
  @Output() onCollectionsModified = new EventEmitter();
  public get isAdmin(): boolean {
    return this.authenticationService.isAuthorized([Role.ADMIN]);
  }

  constructor(
    private authenticationService: AuthenticationService,
    private restAPIConnector: RestApiConnectorService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    // intentionally left blank
  }

  public get showActions(): boolean {
    return (
      !this.config.hasOwnProperty('show_actions') || this.config.show_actions
    );
  }

  public showReleaseNotes(
    version: CollectionVersion,
    collection: CollectionReference
  ) {
    this.dialog.open(MarkdownViewDialogComponent, {
      data: {
        markdown: version.release_notes,
        title: `${collection.name} v${version.version.toString()} Release Notes`,
      },
      autoFocus: false, // prevents auto focus on buttons
    });
  }

  public versionDownloaded(
    version: CollectionVersion,
    ref: CollectionReference
  ): boolean {
    return this.config.subscribed_collections.some(subscribed => {
      const matcher = `${ref.id}@${version.modified}`;
      return matcher == subscribed;
    });
  }

  /**
   * Subscribe to the given collection reference
   * @param {CollectionReference} collectionRef
   * @memberof CollectionIndexViewComponent
   */
  public subscribe(collectionRef: CollectionReference) {
    // confirm that the user actually wants to do this
    const prompt = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '35em',
      data: {
        message: `## Subscribe to ${collectionRef.name}?\n\n Subscribing will download the most recent version of ${collectionRef.name}. New versions of the collection will automatically download when they are released.`,
        yes_suffix: 'keep the collection updated',
      },
      autoFocus: false, // prevents auto focus on buttons
    });
    const subscription = prompt.afterClosed().subscribe({
      next: result => {
        // if they clicked yes, subscribe to the collection
        if (result) {
          const subscribedCollections = new Set<string>(
            this.config.index.workspace.update_policy.subscriptions
          );
          const subscriptionID = collectionRef.id; //id to toggle
          // add subscription
          subscribedCollections.add(subscriptionID);
          // set in object
          this.config.index.workspace.update_policy.subscriptions = Array.from(
            subscribedCollections
          );
          // PUT result to backend
          this.restAPIConnector
            .putCollectionIndex(
              this.config.index,
              `subscribed to ${collectionRef.name}`
            )
            .subscribe(() => {
              this.onCollectionsModified.emit();
            });
        }
      },
      complete: () => {
        subscription.unsubscribe();
      }, //prevent memory leaks
    });
  }

  public unsubscribe(collectionRef: CollectionReference) {
    // confirm that the user actually wants to do this
    const prompt = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '35em',
      data: {
        message: `## Unsubscribe from ${collectionRef.name}?\n\n Unsubscribing will mean you won't automatically receive updates to ${collectionRef.name}. Previously downloaded versions of this collection will **not** be deleted.`,
        yes_suffix: 'unsubscribe',
      },
      autoFocus: false, // prevents auto focus on buttons
    });
    prompt.afterClosed().subscribe(result => {
      // if they clicked yes, subscribe to the collection
      if (result) {
        const subscribedCollections = new Set<string>(
          this.config.index.workspace.update_policy.subscriptions
        );
        const subscriptionID = collectionRef.id; //id to toggle
        // remove subscription
        subscribedCollections.delete(subscriptionID);
        // set in object
        this.config.index.workspace.update_policy.subscriptions = Array.from(
          subscribedCollections
        );
        // PUT result to backend
        this.restAPIConnector
          .putCollectionIndex(
            this.config.index,
            `unsubscribed from ${collectionRef.name}`
          )
          .subscribe(() => {
            this.onCollectionsModified.emit();
          });
      }
    });
  }

  public removeIndex() {
    // confirm that the user actually wants to do this
    const prompt = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '35em',
      data: {
        message: 'Are you sure you want to remove the collection index?',
        yes_suffix: 'delete it',
      },
      autoFocus: false, // prevents auto focus on buttons
    });
    const promptSubscription = prompt.afterClosed().subscribe({
      next: result => {
        // if they clicked yes, delete the index
        if (result) {
          const subscription = this.restAPIConnector
            .deleteCollectionIndex(this.config.index.collection_index.id)
            .subscribe({
              next: () => {
                this.onCollectionsModified.emit();
              },
              complete: () => {
                subscription.unsubscribe();
              }, //prevent memory leaks
            });
        }
      },
      complete: () => {
        promptSubscription.unsubscribe();
      }, //prevent memory leaks
    });
  }

  public onVersionClick(version: CollectionVersion, ref: CollectionReference) {
    if (this.versionDownloaded(version, ref)) {
      //view prior import
      this.router.navigate([
        `/collection/${ref.id}/modified/${version.modified.toISOString()}`,
      ]);
    } else {
      // go to download page
      if (this.isAdmin)
        this.router.navigate(['/collection/import-collection'], {
          queryParams: { url: encodeURIComponent(version.url) },
        });
    }
  }
}
export interface CollectionIndexViewConfig {
  // the index to show
  index: CollectionIndex;
  // "id@modified" for every subscribed collection.
  // Used to determine if the given collection versions have been imported already
  subscribed_collections: any[];
  // default false. If true, show the collection title in the component
  show_title: boolean;
  // default true. If false, hides subscribe actions from the component
  show_actions: boolean;
}
