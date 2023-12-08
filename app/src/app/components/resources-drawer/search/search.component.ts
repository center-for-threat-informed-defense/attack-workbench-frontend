import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { StixObject } from 'src/app/classes/stix';
import { Paginated, RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements AfterViewInit, OnDestroy {
    @ViewChild('search') input: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    public searchQuery: string = "";
    public searchSubscription: Subscription;
    public searchResults$: Observable<Paginated<StixObject>>;
    public resultCount: number = 0;

    constructor(private restApiService: RestApiConnectorService, public snackbar: MatSnackBar) { }

    ngAfterViewInit(): void {
        let searchSubscription = fromEvent(this.input.nativeElement, 'keyup').pipe(
            filter(Boolean),
            debounceTime(250),
            distinctUntilChanged(),
            tap(_ => { this.getResults(); })
        );
        searchSubscription.subscribe();
    }

    ngOnDestroy(): void {
        if (this.searchSubscription) this.searchSubscription.unsubscribe();
    }

    /**
     * Get the LinkById tag for the given object
     * @param obj the STIX object
     */
    public getLinkById(obj: StixObject): string {
        return `(LinkById: ${obj.attackID})`;
    }

    /**
     * Get the internal link to the object
     * @param obj the STIX object
     */
    public internalLink(obj: StixObject): string {
        return `/${obj.attackType}/${obj.stixID}`;
    }

    /**
     * Show the snackbar copy confirmation message
     */
    public showSnackbar(): void {
        this.snackbar.open(`LinkById copied to clipboard`, null, {duration: 1000});
    }

    /**
     * Retrieve the search results for the specified query
     */
    public getResults() {
        let limit = this.paginator? this.paginator.pageSize : 10;
        let offset = this.paginator? this.paginator.pageIndex * limit : 0;

        let options = {
            limit: limit,
            offset: offset,
            revoked: true,
            deprecated: true,
            search: this.searchQuery,
            deserialize: true
        }
        this.searchResults$ = this.restApiService.getAllObjects(options);
        let subscription = this.searchResults$.subscribe({
            next: (data) => {
                console.log(data);
                this.resultCount = data.pagination.total;
            },
            complete: () => { subscription.unsubscribe() }
        })
    }
}
