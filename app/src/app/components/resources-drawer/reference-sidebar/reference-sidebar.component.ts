import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { ExternalReference } from 'src/app/classes/external-references';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { Paginated, RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { ReferenceEditDialogComponent } from 'src/app/components/reference-edit-dialog/reference-edit-dialog.component';

@Component({
  selector: 'app-reference-sidebar',
  templateUrl: './reference-sidebar.component.html',
  styleUrls: ['./reference-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReferenceSidebarComponent implements OnInit, AfterViewInit {
    public newRef: ExternalReference = {
        source_name: "",
        description: "",
        url: ""
    }

    @Input() editable: boolean = true;
    @ViewChild('search') search: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    public references$: Observable<Paginated<ExternalReference>>;
    public totalObjectCount: number = 0;
    public get canEdit(): boolean { return this.authenticationService.canEdit(); }
    
    constructor(private restApiConnector: RestApiConnectorService, public snackbar: MatSnackBar, public dialog: MatDialog, private authenticationService: AuthenticationService) { }

    public newReference() {
        let ref = this.dialog.open(ReferenceEditDialogComponent, {
            maxHeight: "75vh",
            data: { mode: 'edit' },
			autoFocus: false, // prevents auto focus on toolbar buttons
        });
        let subscription = ref.afterClosed().subscribe({
            complete: () => {
                this.applyControls(this.search.nativeElement.value);
                subscription.unsubscribe();
            }
        });
    }

    /**
     * Given a source_name, get the citation text
     * @param {*} source_name the source_name of the reference
     * @returns the citation text
     */
    public getCitation(source_name) {
        return `(Citation: ${source_name})`
    }

    public applyControls(search?: string) {
        let limit = this.paginator? this.paginator.pageSize : 10;
        let offset = this.paginator? this.paginator.pageIndex * limit : 0;
        this.references$ = this.restApiConnector.getAllReferences(limit, offset, search);
        let subscription = this.references$.subscribe({
            next: (data) => { this.totalObjectCount = data.pagination.total; },
            complete: () => { subscription.unsubscribe() }
        })
    }

    ngOnInit(): void {
        // intentionally left blank
    }

    ngAfterViewInit() {
        this.applyControls();
        fromEvent(this.search.nativeElement, 'keyup').pipe(
            filter(Boolean),
            debounceTime(250),
            distinctUntilChanged(),
            tap(_ => {
                if (this.paginator) this.paginator.pageIndex = 0;
                let el = _ as any;
                let query = el.target.value? el.target.value : null;
                this.applyControls(query)
            })
        ).subscribe()
    }

}
