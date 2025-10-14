import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { forkJoin } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { MatSelect } from '@angular/material/select';
import { StixListComponent } from 'src/app/components/stix/stix-list/stix-list.component';
import { StixListConfig } from 'src/app/components/stix/stix-list/stix-list.component';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
  animations: [
    trigger('detailExpand', [
      transition(':enter', [
        style({ height: '0px', minHeight: '0px' }),
        animate('100ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ height: '*' })),
      ]),
      transition(':leave', [
        animate(
          '100ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          style({ height: '0px', minHeight: '0px' })
        ),
      ]),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(
          '500ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          style({ opacity: '1' })
        ),
      ]),
    ]),
  ],
})
export class ReviewListComponent extends StixListComponent implements OnInit {
  /**
   * ReviewListComponent is a specialized list used on the Dashboard Review page.
   * It inherits all functionality from StixListComponent but overrides:
   *  - ngOnInit: removes any forced object type so that all STIX types are fetched.
   *  - applyControls: when no type is set, it performs parallel REST calls for every
   *    supported STIX object type via forkJoin, merges the results, and applies the
   *    standard search, filter, and pagination logic.
   *  - buildTable: defines a minimal column set (workflow status, type, ID, name,
   *    modified, created) suitable for review purposes.
   *
   * The component respects the `filterList` configuration, which is set to only
   * include the workflow‑status dropdown, removing domain and platform filters.
   */
  @Input() public config: StixListConfig = {};

  @Output() public onRowAction = new EventEmitter<string>();
  @Output() public onSelect = new EventEmitter<StixObject>();
  @Output() public refresh = new EventEmitter();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('search') search: ElementRef;
  @ViewChild(MatSelect) matSelect: MatSelect;
  private previousPageSize: number = 0;

  ngOnInit(): void {
    this.config.select = 'many';
    this.config.showFilters = true;
    this.config.showControls = true;
    this.config.filterList = [];
    super.ngOnInit();
    // Set default sort to modified descending
    if (this.sort) {
      this.sort.sort({ id: 'modified', start: 'desc', disableClear: true });
    }
    // Define concise workflow status filter options
    this.filterOptions = [];
    this.filterOptions.push({
      name: 'workflow status',
      disabled: false,
      values: [
        {
          value: 'status.work-in-progress',
          label: 'work in progress',
          disabled: false,
        },
        {
          value: 'status.awaiting-review',
          label: 'awaiting review',
          disabled: false,
        },
        { value: 'status.reviewed', label: 'reviewed', disabled: false },
      ],
    });
  }

  /**
   * Override applyControls to sort by Modified date descending.
   */
  /**
   * Override applyControls to fetch all STIX object types when no specific type is set.
   * If a type is defined, fall back to the base implementation.
   */
  public applyControls(): void {
    if (this.config.type) {
      // Use default behavior for a specific type
      super.applyControls();
      // Ensure sorting by modified descending
      if (this.data$) {
        this.data$ = this.data$.pipe(
          map(paginated => {
            const sorted = (paginated as any).data.sort((a: any, b: any) => {
              const aMod = a.modified ? new Date(a.modified).getTime() : 0;
              const bMod = b.modified ? new Date(b.modified).getTime() : 0;
              return bMod - aMod;
            });
            return { ...(paginated as any), data: sorted };
          })
        );
      }
    } else {
      // No specific type – fetch **all** supported STIX objects in parallel
      // Reset to first page when page size changes to keep pagination correct
      if (this.paginator && this.previousPageSize !== this.paginator.pageSize) {
        this.paginator.pageIndex = 0;
        this.previousPageSize = this.paginator.pageSize;
      }
      const limit = this.paginator ? this.paginator.pageSize : 10;
      const offset = this.paginator ? this.paginator.pageIndex * limit : 0;

      // Parallel requests for each object type
      const allRequests = forkJoin({
        techniques: (this as any).restAPIConnectorService.getAllTechniques({
          search: this.searchQuery,
        }),
        tactics: (this as any).restAPIConnectorService.getAllTactics({
          search: this.searchQuery,
        }),
        software: (this as any).restAPIConnectorService.getAllSoftware({
          search: this.searchQuery,
        }),
        mitigations: (this as any).restAPIConnectorService.getAllMitigations({
          search: this.searchQuery,
        }),
        dataSources: (this as any).restAPIConnectorService.getAllDataSources({
          search: this.searchQuery,
        }),
        dataComponents: (
          this as any
        ).restAPIConnectorService.getAllDataComponents({
          search: this.searchQuery,
        }),
        groups: (this as any).restAPIConnectorService.getAllGroups({
          search: this.searchQuery,
        }),
        matrices: (this as any).restAPIConnectorService.getAllMatrices({
          search: this.searchQuery,
        }),
        assets: (this as any).restAPIConnectorService.getAllAssets({
          search: this.searchQuery,
        }),
        notes: (this as any).restAPIConnectorService.getAllNotes({
          search: this.searchQuery,
        }),
        markingDefinitions: (
          this as any
        ).restAPIConnectorService.getAllMarkingDefinitions({
          search: this.searchQuery,
        }),
      });

      this.data$ = allRequests.pipe(
        map((results: any) => {
          // Concatenate all arrays into a single list
          const combined: any[] = ([] as any[]).concat(
            results.techniques.data,
            results.tactics.data,
            results.software.data,
            results.mitigations.data,
            results.dataSources.data,
            results.dataComponents.data,
            results.groups.data,
            results.matrices.data,
            results.assets.data,
            results.notes.data,
            results.markingDefinitions.data
          );
          // Update total object count for paginator

          // Apply client‑side filtering (search, workflow status, etc.)
          let filtered = (this as any).filterObjects(
            this.searchQuery,
            combined
          );
          // Apply workflow status filters (multi‑select)
          const statusFilters = this.filter
            .filter((x: string) => x.startsWith('status.'))
            .map(f => f.split('status.')[1]);
          if (statusFilters.length) {
            filtered = filtered.filter(
              (obj: any) =>
                obj.workflow && statusFilters.includes(obj.workflow.state)
            );
          }
          const sorted = filtered.sort((a: any, b: any) => {
            const aMod = a.modified ? new Date(a.modified).getTime() : 0;
            const bMod = b.modified ? new Date(b.modified).getTime() : 0;
            return bMod - aMod;
          });
          // Update total object count for paginator based on filtered results
          this.totalObjectCount = filtered.length;

          // Pagination slice with bounds check
          let start = offset;
          // If start exceeds filtered results, reset to first page
          if (this.paginator && start >= filtered.length) {
            this.paginator.pageIndex = 0;
            start = 0;
          }
          const end = start + limit;
          const pageData = sorted.slice(start, end);

          return {
            data: pageData,
            pagination: {
              total: filtered.length,
              offset: start,
              limit: limit,
            },
          };
        })
      );
    }
  }

  /**
   * Build a simplified table for review purposes.
   * Columns: Type, ID, Name, Modified, Created.
   */
  protected buildTable(): void {
    // Reset any previous columns
    this.tableColumns = [];
    this.tableColumns_settings.clear();

    // Workflow status icon column (appears after select)
    this.addColumn('', 'workflow', 'icon');

    // Type column
    this.addColumn('Type', 'attackType', 'plain', false);
    // ID column
    this.addColumn('ID', 'attackID', 'plain', false);
    // Name column (sticky if selection enabled)
    const stickyAllowed = !(
      this.config.select && this.config.select === 'disabled'
    );
    this.addColumn('Name', 'name', 'plain', stickyAllowed, ['name']);
    // Modified and Created timestamps
    this.addVersionsAndDatesColumns(); // adds version, modified, created
    // Remove version column (not needed for review)
    const versionIdx = this.tableColumns.indexOf('version');
    if (versionIdx !== -1) {
      this.tableColumns.splice(versionIdx, 1);
      this.tableColumns_settings.delete('version');
    }
  }
}
