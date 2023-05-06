import { EventEmitter, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SidebarService } from '../sidebar/sidebar.service';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../connectors/authentication/authentication.service';
import { RestApiConnectorService } from '../connectors/rest-api/rest-api-connector.service';
import { first, map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Relationship } from 'src/app/classes/stix/relationship';

@Injectable({
    providedIn: 'root'
})
export class EditorService {

    /* The underlying STIX object's `revoked` property (`this.config.object.revoked`) is made shareable to components
     * by mapping it to an observable called `revokedSubject`, which is maintained here in the EditorService. */
    private revokedSubject = new Subject<boolean>();

    /* Subscribers subscribe to `revoked$ to be notified when the `revoked` property contained within `revokedSubject`
     * changes. */
    public revoked$ = this.revokedSubject.asObservable(); // Subscribers can receive updates whenever `revoked` changes

    /* Though the `revokedSubject` is hosted here in EditorService, the EditorService also subscribes to `revoked$`;
     * that subscribable value is mapped here to `revoked`, which the EditorService references every time the route
     * changes. */
    private revoked = false;

    public editable: boolean = false;
    public editing: boolean = false;
    public deletable: boolean = false;
    public hasRelationships: boolean = true;
    public onSave = new EventEmitter();
    public onDelete = new EventEmitter();
    public onEditingStopped = new EventEmitter();
    public onReload = new EventEmitter();
    public onReloadReferences = new EventEmitter();

    public get stixId(): string { return this.router.url.split("/")[2].split("?")[0]; }
    public get type(): string { return this.router.url.split("/")[1]; }
    public get sidebarEnabled(): boolean { return this.type != 'reference-manager'; }

    constructor(private router: Router,
        private route: ActivatedRoute,
        private sidebarService: SidebarService,
        private authenticationService: AuthenticationService,
        private restAPIConnectorService: RestApiConnectorService,
        private dialog: MatDialog) {

        /**
         * EditorService must subscribe to revoked$ to remain informed of the current value of `revoked`.
         *
         * ObjectStatusComponent updates the revoked$ value whenever the underlying STIX object's `revoked` property is
         * changed.
         *
         * Each StixViewPage child class (e.g., TechniqueViewComponent) updates the `revoked$ value whenever it is
         * initialized in ngOnInit.
         */
        this.revoked$.pipe(first()).subscribe(value => {
          this.revoked = value;
        });

        this.router.events.subscribe(event => {
          if (event instanceof NavigationEnd) {
            let editable = this.getEditableFromRoute(this.router.routerState, this.router.routerState.root);
            let attackType = this.route.root.firstChild.snapshot.data.breadcrumb;
            this.editable = editable.length > 0 && editable.every(x => x) && this.authenticationService.canEdit(attackType) && !this.revoked;
            this.sidebarService.setEnabled("history", this.editable);
            this.sidebarService.setEnabled("notes", this.editable);
            if (!this.editable) this.sidebarService.currentTab = "references";

            if (this.editable) {
              if (this.router.url.includes("/new") || ["matrix", "tactic", "collection"].includes(this.type)) {
                // new objects, matrices, tactics, and collections cannot be deleted
                this.deletable = false;
              } else {
                this.deletable = true;
                // determine if this object has existing relationships
                this.getRelationships().subscribe(rels => this.hasRelationships = rels > 0);
              }
            }
          }
        });
        this.route.queryParams.subscribe(params => {
            this.editing = params["editing"] && this.authenticationService.canEdit();
        });
    }

    public startEditing() {
        if (this.editable) this.router.navigate([], { queryParams: { editing: true } })
    }

    public stopEditing() {
        let prompt = this.dialog.open(ConfirmationDialogComponent, {
            maxWidth: "35em",
            data: {
                message: '# Are you sure you want to discard changes?',
            }
        });

        let subscription = prompt.afterClosed().subscribe({
            next: (result) => {
                if (result) {
                    if (!(this.router.url.includes("/new"))) this.router.navigate([], { queryParams: {} })
                    else this.router.navigate([".."], { queryParams: {} })
                    this.onEditingStopped.emit();
                }
            },
            complete: () => { subscription.unsubscribe(); } //prevent memory leaks
        });
    }

    //https://stackoverflow.com/questions/38644314/changing-the-page-title-using-the-angular-2-new-router/38652281#38652281
    private getEditableFromRoute(state, parent) {
        let data = [];
        if (parent && parent.snapshot.data && parent.snapshot.data.editable) {
            data.push(parent.snapshot.data.editable);
        }

        if (state && parent) {
            data.push(... this.getEditableFromRoute(state, state.firstChild(parent)));
        }
        return data;
    }

    /**
     * Determine whether or not this object has relationships with other objects
     */
    public getRelationships(): Observable<number> {
        if (this.type == "data-source") {
            return this.restAPIConnectorService.getDataSource(this.stixId, null, "latest", false, false, true).pipe(
                map(dataSource => dataSource[0] && dataSource[0].data_components.length)
            );
        } else {
            return this.restAPIConnectorService.getRelatedTo({sourceOrTargetRef: this.stixId}).pipe(
                map(relationships => {
                    return relationships.data.filter((r: Relationship) => {
                        // filter out subtechnique-of relationships, IFF this is the source object (sub-technique)
                        // note: the subtechique-of relationship is automatically deleted with the sub-technique object
                        return !(r.relationship_type == 'subtechnique-of' && r.source_object && r.source_object["stix"]["id"] == this.stixId)
                    }).length;
                })
            );
        }
    }

  /**
   * Updates the value of `revoked` and notifies all subscribers.
   *
   * This is used by STIX derivative components (e.g., TechniqueComponent) and the ToolbarComponent. The
   * ToolbarComponent conditionally renders the "edit" button based on whether on not the STIX object currently
   * in view is revoked or not. The `revoked` property is synchronized via a one-way data flow from each STIX component
   * to the ToolbarComponent. This is made possible by this observable; TechniqueComponent updates `revoked` by calling
   * the `updateRevoked` function, and the function emits an event everytime the property changes. ToolbarComponent
   * subscribes to the observable, so it always receives the latest value of `revoked`.
   *
   * @param value `true` if STIX object is revoked or `false` if STIX object is not revoked
   */
  public updateRevoked(value: boolean): void {
      this.revokedSubject.next(value);
  }
}
