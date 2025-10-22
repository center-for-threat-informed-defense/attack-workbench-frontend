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
import { forkJoin, Observable, of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { MatSelect } from '@angular/material/select';
import { MatOption, MatOptionSelectionChange } from '@angular/material/core';
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
   * Review list with a custom dropdown (same look) that exposes only two
   * workflow filters and enforces radio-like behavior. It never shows
   * objects outside ['work-in-progress','awaiting-review'].
   */
  @Input() public config: StixListConfig = {};

  @Output() public onSelect = new EventEmitter<StixObject>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('search') search: ElementRef;
  @ViewChild(MatSelect) matSelect: MatSelect;

  private previousPageSize = 0;
  private readonly ALLOWED_STATES = [
    'work-in-progress',
    'awaiting-review',
  ] as const;

  ngOnInit(): void {
    this.config.select = 'many';
    this.config.showControls = true;

    this.config.filterList = [];

    super.ngOnInit();
  }

  /**
   * Force single-select behavior inside a multi-select MatSelect:
   * - Selecting one status removes any other selected status.
   * - Deselecting clears status (default shows BOTH allowed states).
   * Also forcibly deselect the other option in the UI.
   */
  public onStatusOptionChange(
    evt: MatOptionSelectionChange,
    value: 'status.work-in-progress' | 'status.awaiting-review'
  ): void {
    if (!evt.isUserInput) return;

    const current = Array.isArray(this.filter) ? [...this.filter] : [];
    const nonStatus = current.filter(v => !v.startsWith('status.'));
    const isSelecting = evt.source.selected;

    if (isSelecting) {
      this.filter = [...nonStatus, value];

      if (this.matSelect) {
        this.matSelect.options.forEach((opt: MatOption) => {
          const isStatus =
            typeof opt.value === 'string' && opt.value.startsWith('status.');
          if (isStatus && opt.value !== value && opt.selected) opt.deselect();
        });
      }
    } else {
      this.filter = nonStatus;
    }

    this.applyControls();
  }

  private filterToAllowedStates(objs: any[]): any[] {
    const onlyAllowed = objs.filter(
      (o: any) => o?.workflow && this.ALLOWED_STATES.includes(o.workflow.state)
    );

    const selectedStatus = (this.filter || []).find(
      (x: string) => typeof x === 'string' && x.startsWith('status.')
    );
    if (!selectedStatus) return onlyAllowed;

    const state = selectedStatus.split('status.')[1];
    return onlyAllowed.filter(o => o.workflow.state === state);
  }

  private sortByModifiedDesc<T extends { modified?: string }>(arr: T[]) {
    return arr.sort((a, b) => {
      const am = a.modified ? new Date(a.modified).getTime() : 0;
      const bm = b.modified ? new Date(b.modified).getTime() : 0;
      return bm - am;
    });
  }

  /**
   * Apply all controls and fetch objects.
   */
  public applyControls(): void {
    if (this.paginator && this.previousPageSize !== this.paginator.pageSize) {
      this.paginator.pageIndex = 0;
      this.previousPageSize = this.paginator.pageSize;
    }
    const limit = this.paginator ? this.paginator.pageSize : 10;
    const offset = this.paginator ? this.paginator.pageIndex * limit : 0;

    if (
      'stixObjects' in this.config &&
      !(this.config.stixObjects instanceof Observable)
    ) {
      let filtered = this.config.stixObjects as any[];

      if (
        Array.isArray(this.userIdsUsedInSearch) &&
        this.userIdsUsedInSearch.length > 0
      ) {
        filtered = filtered.filter(
          (obj: any) =>
            obj.workflow &&
            this.userIdsUsedInSearch.includes(
              obj.workflow.created_by_user_account
            )
        );
      }

      filtered = (this as any).filterObjects(this.searchQuery, filtered);

      filtered = this.filterToAllowedStates(filtered);

      filtered = this.sortByModifiedDesc(filtered);

      this.totalObjectCount = filtered.length;
      let start = offset;
      if (this.paginator && start >= filtered.length) {
        this.paginator.pageIndex = 0;
        start = 0;
      }
      const pageData = filtered.slice(start, start + limit);

      this.data$ = of({
        data: pageData,
        pagination: { total: filtered.length, offset: start, limit },
      });
      return;
    }

    const optionsCommon = {
      limit,
      offset,
      excludeIDs: this.config.excludeIDs,
      search: this.searchQuery,
      includeRevoked: false,
      includeDeprecated: false,
      platforms: undefined,
      domains: undefined,
      lastUpdatedBy: this.userIdsUsedInSearch,
    };

    if (this.config.type) {
      const type = this.config.type;
      let obs: Observable<any>;
      const svc = (this as any).restAPIConnectorService;

      switch (type) {
        case 'software':
          obs = svc.getAllSoftware(optionsCommon);
          break;
        case 'campaign':
          obs = svc.getAllCampaigns(optionsCommon);
          break;
        case 'group':
          obs = svc.getAllGroups(optionsCommon);
          break;
        case 'matrix':
          obs = svc.getAllMatrices(optionsCommon);
          break;
        case 'mitigation':
          obs = svc.getAllMitigations(optionsCommon);
          break;
        case 'tactic':
          obs = svc.getAllTactics(optionsCommon);
          break;
        case 'technique':
          obs = svc.getAllTechniques(optionsCommon);
          break;
        case 'log-source':
          obs = svc.getAllLogSources(optionsCommon);
          break;
        case 'detection-strategy':
          obs = svc.getAllDetectionStrategies(optionsCommon);
          break;
        case 'analytic':
          obs = svc.getAllAnalytics({ ...optionsCommon, includeRefs: true });
          break;
        case 'data-source':
          obs = svc.getAllDataSources(optionsCommon);
          break;
        case 'data-component':
          obs = svc.getAllDataComponents(optionsCommon);
          break;
        case 'asset':
          obs = svc.getAllAssets(optionsCommon);
          break;
        case 'marking-definition':
          obs = svc.getAllMarkingDefinitions(optionsCommon);
          break;
        case 'note':
          obs = svc.getAllNotes(optionsCommon);
          break;
        default:
          if (type.includes('collection')) {
            obs = svc.getAllCollections({
              search: this.searchQuery,
              versions: 'all',
            });
          } else if (type === 'relationship') {
            obs = svc.getRelatedTo({
              sourceRef: this.config.sourceRef,
              targetRef: this.config.targetRef,
              sourceType: this.config.sourceType,
              targetType: this.config.targetType,
              relationshipType: this.config.relationshipType,
              excludeSourceRefs: this.config.excludeSourceRefs,
              excludeTargetRefs: this.config.excludeTargetRefs,
              limit,
              offset,
              includeDeprecated: false,
            });
          } else {
            obs = of({ data: [], pagination: { total: 0, offset, limit } });
          }
      }

      this.data$ = obs.pipe(
        map((paginated: any) => {
          const data = Array.isArray(paginated?.data) ? paginated.data : [];
          const searched = (this as any).filterObjects(this.searchQuery, data);
          const filtered = this.filterToAllowedStates(searched);
          const sorted = this.sortByModifiedDesc(filtered);

          this.totalObjectCount = sorted.length;

          let start = offset;
          if (this.paginator && start >= sorted.length) {
            this.paginator.pageIndex = 0;
            start = 0;
          }
          const end = start + limit;

          return {
            data: sorted.slice(start, end),
            pagination: { total: sorted.length, offset: start, limit },
          };
        })
      );
    } else {
      const svc = (this as any).restAPIConnectorService;
      const allRequests = forkJoin({
        techniques: svc.getAllTechniques({ search: this.searchQuery }),
        tactics: svc.getAllTactics({ search: this.searchQuery }),
        software: svc.getAllSoftware({ search: this.searchQuery }),
        mitigations: svc.getAllMitigations({ search: this.searchQuery }),
        dataSources: svc.getAllDataSources({ search: this.searchQuery }),
        dataComponents: svc.getAllDataComponents({ search: this.searchQuery }),
        groups: svc.getAllGroups({ search: this.searchQuery }),
        matrices: svc.getAllMatrices({ search: this.searchQuery }),
        assets: svc.getAllAssets({ search: this.searchQuery }),
        notes: svc.getAllNotes({ search: this.searchQuery }),
        markingDefinitions: svc.getAllMarkingDefinitions({
          search: this.searchQuery,
        }),
      });

      this.data$ = allRequests.pipe(
        map((results: any) => {
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

          const searched = (this as any).filterObjects(
            this.searchQuery,
            combined
          );
          const filtered = this.filterToAllowedStates(searched);
          const sorted = this.sortByModifiedDesc(filtered);

          this.totalObjectCount = sorted.length;

          let start = offset;
          if (this.paginator && start >= sorted.length) {
            this.paginator.pageIndex = 0;
            start = 0;
          }
          const end = start + limit;

          return {
            data: sorted.slice(start, end),
            pagination: { total: sorted.length, offset: start, limit },
          };
        })
      );
    }
  }

  protected buildTable(): void {
    this.tableColumns = [];
    this.tableColumns_settings.clear();

    this.addColumn('', 'workflow', 'icon');
    this.addColumn('Type', 'attackType', 'plain', false);
    this.addColumn('ID', 'attackID', 'plain', false);

    const stickyAllowed = !(
      this.config.select && this.config.select === 'disabled'
    );
    this.addColumn('Name', 'name', 'plain', stickyAllowed, ['name']);

    this.addVersionsAndDatesColumns();
    const versionIdx = this.tableColumns.indexOf('version');
    if (versionIdx !== -1) {
      this.tableColumns.splice(versionIdx, 1);
      this.tableColumns_settings.delete('version');
    }
  }
}
