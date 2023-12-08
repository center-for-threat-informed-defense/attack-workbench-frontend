import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { StixObject } from 'src/app/classes/stix';
import { Paginated, RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { FilterGroup } from '../../stix/stix-list/stix-list.component';

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

    public getLinkById(result: StixObject): string {
        return `(LinkById: ${result.attackID})`;
    }

    public internalLink(result: StixObject): string {
        return `/${result.attackType}/${result.stixID}`;
    }

    public showSnackbar(result: StixObject): void {
        this.snackbar.open(`LinkById copied to clipboard: ${result.attackID}`, null, {duration: 1000});
    }

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

    ngOnDestroy(): void {
        if (this.searchSubscription) this.searchSubscription.unsubscribe();
    }
}
