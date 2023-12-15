import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { StixObject } from 'src/app/classes/stix';
import { Paginated, RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { EditorService } from 'src/app/services/editor/editor.service';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';

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

    constructor(private restApiService: RestApiConnectorService,
                public editorService: EditorService,
                private router: Router,
                private dialog: MatDialog,
                public snackbar: MatSnackBar) {
        // intentionally left blank
    }

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
     * Navigate to the internal object link
     * If an object is being edited, open confirmation dialog
     * @param obj the STIX object to navigate to
     */
    public navigateTo(obj: StixObject): void {
        if (this.editorService.editing) {
            this.stopEditingAndNavigate(obj);
        }
        else {
            this.router.navigate([`/${obj.attackType}/${obj.stixID}`], { queryParams: {} });
        }
    }

    /**
     * Opens a confirmation dialog and navigates
     * to the search result
     * @param obj the STIX object to navigate to
     */
    public stopEditingAndNavigate(obj: StixObject): void {
        let prompt = this.dialog.open(ConfirmationDialogComponent, {
            maxWidth: "35em",
            data: {
                message: '# Are you sure you want to discard changes?',
            }
        });

        let subscription = prompt.afterClosed().subscribe({
            next: (result) => {
                if (result) {
                    this.editorService.onEditingStopped.emit();
                    this.router.navigate([`/${obj.attackType}/${obj.stixID}`], { queryParams: {} });
                } // otherwise do nothing
            },
            complete: () => { subscription.unsubscribe(); } //prevent memory leaks
        });
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
