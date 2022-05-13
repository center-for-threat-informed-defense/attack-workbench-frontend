import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
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
    public references$: Observable<Paginated<ExternalReference>>;
    public totalReferences: number = 0;
    public columnDefs: string[] = ['citation', 'reference', 'count', 'open'];
    public referenceMap: Map<string, number> = new Map(); // reference.source_name => number
    public loading: boolean = false;
    private searchSubscription: Subscription;
    public searchQuery: string = "";

    public get canEdit(): boolean { return this.authenticationService.canEdit(); }

    constructor(private authenticationService: AuthenticationService, private restApiConnector: RestApiConnectorService, public dialog: MatDialog, public snackbar: MatSnackBar) { }

    ngOnInit(): void {
        this.buildReferenceMap();
        this.applyControls();
    }

    ngAfterViewInit(): void {
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
     * @param {*} source_name the source_name of the reference
     * @returns the citation text
     */
    public getCitation(source_name): string {
        return `(Citation: ${source_name})`
    }

    public openReference(reference?: ExternalReference): void {
        let ref = this.dialog.open(ReferenceEditDialogComponent, {
            maxHeight: "75vh",
            data: {
                mode: reference ? 'view' : 'edit',
                reference: reference
            }
        });
        let subscription = ref.afterClosed().subscribe({
            complete: () => {
                this.applyControls(this.search.nativeElement.value);
                subscription.unsubscribe();
            }
        });
    }

    public applyControls(search?: string): void {
        let limit = this.paginator ? this.paginator.pageSize : 10;
        let offset = this.paginator ? this.paginator.pageIndex * limit : 0;
        this.references$ = this.restApiConnector.getAllReferences(limit, offset, this.searchQuery);
        let subscription = this.references$.subscribe({
            next: (data) => {
                this.totalReferences = data.pagination.total;
            },
            complete: () => { subscription.unsubscribe() }
        })
    }

    public buildReferenceMap(): void {
        this.loading = true;
        let subscription = forkJoin({
            references: this.restApiConnector.getAllReferences(),
            objects: this.restApiConnector.getAllObjects()
        }).pipe(
            map(api_results => {
                let allObjects = api_results.objects as StixObject[];
                let uses = function(reference: ExternalReference) {
                    let hasReference: StixObject[] = allObjects.filter(o => {
                        let ext_refs: any[] = o['stix'] && o['stix']['external_references'] && o['stix']['external_references'].length > 0 ? o['stix']['external_references'] : undefined;
                        if (!ext_refs) return false; // object does not have external references
                        let sources = ext_refs.map(ref => ref.source_name);
                        if (sources.includes(reference.source_name)) return true;
                        return false;
                    });
                    return hasReference.length;
                }
                api_results.references.data.forEach(ref => this.referenceMap[ref.source_name] = uses(ref));
            })
        )
        .subscribe({
            complete: () => {
                this.loading = false;
                if (subscription) subscription.unsubscribe();
            }
        })
    }

    public referenceCount(source: string): number {
        if (!source) return 0;
        return this.referenceMap[source];
    }
}
