import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { ExternalReference } from 'src/app/classes/external-references';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { ReferenceEditDialogComponent } from 'src/app/components/reference-edit-dialog/reference-edit-dialog.component';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { Paginated, RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
    selector: 'app-reference-manager',
    templateUrl: './reference-manager.component.html',
    styleUrls: ['./reference-manager.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ReferenceManagerComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('search') search: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public attackObjects: StixObject[]; // all objects in the knowledge base
    public references$: Observable<Paginated<ExternalReference>>;
    public totalReferences: number = 0;
    public columnDefs: string[] = ['citation', 'reference', 'count', 'open'];
    public referenceMap: Map<string, number> = new Map(); // reference.source_name => number of objects that use the reference
    public loading: boolean = false;
    private searchSubscription: Subscription;
    public searchQuery: string = "";

    public get canEdit(): boolean { return this.authenticationService.canEdit(); }

    constructor(private authenticationService: AuthenticationService,
                private restApiConnector: RestApiConnectorService,
                public dialog: MatDialog,
                public snackbar: MatSnackBar) { }

    ngOnInit(): void {
        let subscription = this.restApiConnector.getAllObjects().subscribe({
            next: (results) => {
                this.attackObjects = results as StixObject[];
            },
            complete: () => {
                this.applyControls();
                if (subscription) subscription.unsubscribe();
            }
        })
    }

    ngAfterViewInit(): void {
        // search functionality
        this.searchSubscription = fromEvent(this.search.nativeElement, 'keyup').pipe(
            filter(Boolean),
            debounceTime(250),
            distinctUntilChanged(),
            tap(_ => { 
                if (this.paginator) this.paginator.pageIndex = 0;
                this.applyControls();
            })
        ).subscribe()
    }

    public ngOnDestroy() {
        if (this.searchSubscription) this.searchSubscription.unsubscribe();
    }

    /**
     * Given a source_name, get the citation text
     * @param {string} source_name the source name of the reference
     * @returns the citation text
     */
    public getCitation(source_name: string): string {
        return `(Citation: ${source_name})`
    }

    /**
     * Open the reference edit dialog.
     * If a reference is provided, a user is viewing an existing reference.
     * Otherwise, open dialog in edit mode to create a new reference.
     * @param {ExternalReference} reference the external reference to view
     */
    public openReference(reference?: ExternalReference): void {
        let prompt = this.dialog.open(ReferenceEditDialogComponent, {
            maxHeight: "75vh",
            data: {
                mode: reference ? 'view' : 'edit',
                reference: reference
            }
        });
        let subscription = prompt.afterClosed().subscribe({
            next: (_result) => {
                if (prompt.componentInstance.dirty) {
                    // re-fetch values since an edit occurred
                    this.applyControls();
                }
            },
            complete: () => subscription.unsubscribe()
        });
    }

    /**
     * Fetch references with pagination and apply search query
     */
    public applyControls(): void {
        this.loading = true;
        let limit = this.paginator ? this.paginator.pageSize : 10;
        let offset = this.paginator ? this.paginator.pageIndex * limit : 0;
        this.references$ = this.restApiConnector.getAllReferences(limit, offset, this.searchQuery);
        let subscription = this.references$.subscribe({
            next: (data) => {
                this.totalReferences = data.pagination.total;

                // build reference lookup map
                let self = this;
                let uses = function(reference: ExternalReference) {
                    // count number of objects that have this reference in its external_references list
                    let usesReference: StixObject[] = self.attackObjects.filter(o => {
                        let ext_refs: any[] = o['stix'] && o['stix']['external_references'] && o['stix']['external_references'].length > 0 ? o['stix']['external_references'] : undefined;
                        if (!ext_refs) return false; // object does not have external references
                        let sources = ext_refs.map(ref => ref.source_name);
                        if (sources.includes(reference.source_name)) return true;
                        return false;
                    });
                    return usesReference.length;
                }
                for (let ref of data.data) {
                    if (!this.referenceMap.has(ref.source_name)) {
                        this.referenceMap[ref.source_name] = uses(ref);
                    }
                }
            },
            complete: () => { subscription.unsubscribe(); this.loading = false; }
        })
    }

    /**
     * Lookup how many objects use the given reference
     * @param {string} source the source name of the reference
     */
    public referenceCount(source: string): number {
        if (!source) return 0;
        return this.referenceMap[source];
    }
}
