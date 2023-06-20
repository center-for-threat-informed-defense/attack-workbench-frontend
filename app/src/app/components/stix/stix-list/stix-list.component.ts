import { Component, OnInit, Input, ViewEncapsulation, ViewChild, AfterViewInit, ElementRef, EventEmitter, Output, OnDestroy } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { fromEvent, Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

import { StixObject } from 'src/app/classes/stix/stix-object';
import { StixDialogComponent } from 'src/app/views/stix/stix-dialog/stix-dialog.component';
import { Paginated, RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { MatSelect } from '@angular/material/select';
import { AddDialogComponent } from '../../add-dialog/add-dialog.component';
import { Collection } from 'src/app/classes/stix/collection';
import { logger } from 'src/app/util/logger';

@Component({
    selector: 'app-stix-list',
    templateUrl: './stix-list.component.html',
    styleUrls: ['./stix-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger("detailExpand", [
            transition(":enter", [
                style({ height: '0px', minHeight: '0px' }),
                animate("100ms cubic-bezier(0.4, 0.0, 0.2, 1)", style({ height: '*' }))
            ]),
            transition(':leave', [
                animate('100ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ height: '0px', minHeight: '0px' }))
            ])
        ]),
        trigger("fadeIn", [
            transition(":enter", [
                style({ opacity: 0 }),
                animate("500ms cubic-bezier(0.4, 0.0, 0.2, 1)", style({ opacity: '1' }))
            ])
        ])
    ]
})
export class StixListComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() public config: StixListConfig = {};

    @Output() public onRowAction = new EventEmitter<string>();
    @Output() public onSelect = new EventEmitter<StixObject>();
    @Output() public refresh = new EventEmitter();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('search') search: ElementRef;
    @ViewChild(MatSelect) matSelect: MatSelect;

    // search query
    public searchQuery: string = "";
    private searchSubscription: Subscription;

    // objects to render
    public objects$: Observable<StixObject[]>;
    public data$: Observable<Paginated<StixObject>>;
    public totalObjectCount: number = 0;

    // view mode
    public mode: string = "cards";

    // options provided to the user for grouping and filtering
    public filterOptions: FilterGroup[] = [];

    // current grouping and filtering selections
    public filter: string[] = [];
    public groupBy: string[] = [];
    public userIdsUsedInSearch = [];

    // TABLE STUFF
    public tableColumns: string[] = [];
    public tableColumns_controls: string[]; //including select behavior
    public tableColumns_settings: Map<string, any> = new Map<string, any>(); // property to display for each displayProperty
    public tableDetail: any[];
    public expandedElement: StixObject | null;

    // Selection stuff
    public selection: SelectionModel<string>;

    // Type map for redirections
    private typeMap = {
        "attack-pattern": "technique",
        "x-mitre-tactic": "tactic",
        "intrusion-set": "group",
        "campaign": "campaign",
        "malware": "software",
        "tool": "software",
        "course-of-action": "mitigation",
        "x-mitre-matrix": "matrix",
        "x-mitre-collection": "collection",
        "relationship": "relationship",
        "note": "note",
        "identity": "identity",
        "marking-definition": "marking-definition",
        "x-mitre-data-source": "data-source",
        "x-mitre-data-component": "data-component"
    }

    // all possible each type of filter/groupBy
    private platformSubscription: Subscription;
    private platformMap: Map<string, Map<string, string[]>> = new Map();
    private domains: FilterValue[] = [
        { "value": "domain.enterprise-attack", "label": "enterprise", "disabled": false },
        { "value": "domain.mobile-attack", "label": "mobile", "disabled": false },
        { "value": "domain.ics-attack", "label": "ics", "disabled": false }
    ]
    private statuses: FilterValue[] = [
        { "value": "status.work-in-progress", "label": "show only work in progress", "disabled": false },
        { "value": "status.awaiting-review", "label": "show only awaiting review", "disabled": false },
        { "value": "status.reviewed", "label": "show only reviewed", "disabled": false }
    ]
    private states: FilterValue[] = [
        { "value": "state.deprecated", "label": "include deprecated", "disabled": false },
        { "value": "state.revoked", "label": "include revoked", "disabled": false }
    ]

    private statesExclusive: FilterValue[] = [
      { "value": "state.exclusive.deprecated", "label": "show only deprecated", "disabled": false },
      { "value": "state.exclusive.revoked", "label": "show only revoked", "disabled": false }
  ]

    public get userSearchString(): string {
        if (this.userIdsUsedInSearch.length === 0) {
            return "filter by users";
        } else {
            return `${this.userIdsUsedInSearch.length} user${this.userIdsUsedInSearch.length === 1 ? '' : 's'} selected`;
        }
    }

    constructor(public dialog: MatDialog,
        private restAPIConnectorService: RestApiConnectorService,
        private router: Router,
        private authenticationService: AuthenticationService,
        private sidebarService: SidebarService) { }

    ngOnInit(): void {
        // build query options for platforms
        this.platformSubscription = this.restAPIConnectorService.getAllAllowedValues().subscribe({
            next: (data) => {
                for (let values of data) {
                    // setup domain map (domainName->platforms)
                    let domainMap: Map<string, string[]> = new Map();
                    if (values.properties) {
                        // extract domain->platforms properties from allowedValues structure
                        let properties = values.properties.find(p => p.propertyName == 'x_mitre_platforms');
                        if (properties && properties.domains) {
                            properties.domains.forEach(domain => {
                                domainMap.set(domain.domainName, domain.allowedValues);
                            });
                        }
                    }
                    // set attackType->domainMap
                    this.platformMap.set(values["objectType"], domainMap);
                }
            },
            complete: () => {
                // build the stix list table
                this.buildTable();
                this.setUpControls();
                // get objects from backend if data is not from config
                if (!("stixObjects" in this.config)) {
                    this.applyControls();
                }
            }
        });
    }

    ngAfterViewInit() {
        // set up listener to search input
        if (this.config.type && this.config.type != "relationship") {
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
    }

    /**
     * Build the stix list table to display
     */
    private buildTable(): void {
        // filter options
        this.filterOptions = []
        if (!('showFilters' in this.config)) this.config.showFilters = true;

        // parse the config
        let sticky_allowed = !(this.config.rowAction && this.config.rowAction.position == "start");
        if ("type" in this.config) {
            // set columns according to type
            switch (this.config.type.replace(/_/g, '-')) {
                case "collection":
                case "collection-created":
                    this.addColumn("name", "name", "plain", sticky_allowed, ["name"]);
                    this.addColumn("released?", "release", "plain", null, ["text-label"]);
                    this.addVersionsAndDatesColumns();
                    this.tableDetail = [{
                        "field": "description",
                        "display": "descriptive"
                    }]
                    break;
                case "collection-imported":
                    this.addColumn("name", "name", "plain", sticky_allowed, ["name"]);
                    this.addColumn("latest version", "version", "version");
                    this.addColumn("imported", "imported", "timestamp");
                    this.addColumn("modified", "modified", "timestamp");
                    this.tableDetail = [{
                        "field": "description",
                        "display": "descriptive"
                    }]
                    break;
                case "mitigation":
                case "tactic":
                    this.addColumn("", "workflow", "icon");
                    this.addColumn("", "state", "icon");
                    this.addColumn("ID", "attackID", "plain", false);
                    this.addColumn("name", "name", "plain", sticky_allowed, ["name"]);
                    this.addColumn("domain", "domains", "list");
                    this.addVersionsAndDatesColumns();
                    this.tableDetail = [{
                        "field": "description",
                        "display": "descriptive"
                    }]
                    break;
                case "matrix":
                    this.addColumn("", "workflow", "icon");
                    this.addColumn("", "state", "icon");
                    this.addColumn("name", "name", "plain", sticky_allowed, ["name"]);
                    this.addVersionsAndDatesColumns();
                    this.tableDetail = [{
                        "field": "description",
                        "display": "descriptive"
                    }]
                    break;
                case "campaign":
                    this.addColumn("", "workflow", "icon");
                    this.addColumn("", "state", "icon");
                    this.addColumn("ID", "attackID", "plain", false);
                    this.addColumn("name", "name", "plain", sticky_allowed, ["name"]);
                    this.addVersionsAndDatesColumns();
                    this.tableDetail = [{
                        "field": "description",
                        "display": "descriptive"
                    }];
                    break;
                case "group":
                    this.addColumn("", "workflow", "icon");
                    this.addColumn("", "state", "icon");
                    this.addColumn("ID", "attackID", "plain", false);
                    this.addColumn("name", "name", "plain", sticky_allowed, ["name"]);
                    this.addColumn("associated groups", "aliases", "list");
                    this.addVersionsAndDatesColumns();
                    this.tableDetail = [{
                        "field": "description",
                        "display": "descriptive"
                    }]
                    break;
                case "software":
                    this.addColumn("", "workflow", "icon");
                    this.addColumn("", "state", "icon");
                    this.addColumn("ID", "attackID", "plain", false);
                    this.addColumn("name", "name", "plain", sticky_allowed, ["name"]);
                    this.addColumn("type", "type", "plain");
                    this.addColumn("domain", "domains", "list");
                    this.addVersionsAndDatesColumns();
                    this.tableDetail = [{
                        "field": "description",
                        "display": "descriptive"
                    }]
                    break;
                case "data-source":
                case "technique":
                    this.addColumn("", "workflow", "icon");
                    this.addColumn("", "state", "icon");
                    this.addColumn("ID", "attackID", "plain", false);
                    this.addColumn("name", "name", "plain", sticky_allowed, ["name"]);
                    this.addColumn("platforms", "platforms", "list");
                    this.addColumn("domain", "domains", "list");
                    this.addVersionsAndDatesColumns();
                    this.tableDetail = [{
                        "field": "description",
                        "display": "descriptive"
                    }]
                    break;
                case "data-component":
                    this.addColumn("", "state", "icon");
                    this.addColumn("name", "name", "plain", sticky_allowed, ["name"]);
                    this.addColumn("domain", "domains", "list");
                    this.addVersionsAndDatesColumns();
                    this.tableDetail = [{
                        "field": "description",
                        "display": "descriptive"
                    }]
                    break;
                case "relationship":
                    this.addColumn("", "state", "icon");
                    if (this.config.relationshipType && this.config.relationshipType !== "detects") {
                        this.addColumn("source", "source_ID", "plain");
                        this.addColumn("", "source_name", "plain", this.config.targetRef ? sticky_allowed : false, ["relationship-name"]);
                    } else this.addColumn("source", "source_name", "plain", this.config.targetRef ? sticky_allowed : false, ["relationship-name"]);
                    this.addColumn("type", "relationship_type", "plain", false, ["text-deemphasis", "relationship-joiner"]);
                    this.addColumn("target", "target_ID", "plain");
                    this.addColumn("", "target_name", "plain", this.config.sourceRef ? sticky_allowed : false, ["relationship-name"]);
                    if (!(this.config.relationshipType && this.config.relationshipType == "subtechnique-of")) this.addColumn("description", "description", "descriptive", false);
                    break;
                case "marking-definition":
                    this.addColumn("definition type", "definition_type", "plain");
                    this.addColumn("created", "created", "timestamp");
                    this.addColumn("definition", "definition_string", "descriptive");
                    this.tableDetail = [{
                        "field": "definition_string",
                        "display": "descriptive"
                    }]
                    break;
                case "note":
                    this.addColumn("title", "title", "plain");
                    this.addColumn("content", "content", "plain");
                    this.addColumn("modified", "modified", "timestamp");
                    this.addColumn("created", "created", "timestamp");
                    break;
                default:
                    this.addColumn("type", "attackType", "plain");
                    this.addColumn("modified", "modified", "timestamp");
                    this.addColumn("created", "created", "timestamp");
            }
        }
        else {
            this.groupBy = ["type"];
            this.addColumn("type", "attackType", "plain");
            this.addColumn("ID", "attackID", "plain", false);
            this.addColumn("name", "name", "plain", true, ["name"]);
            this.addColumn("modified", "modified", "timestamp");
            this.addColumn("created", "created", "timestamp");
        }
    }

    /**
     * Set up controls, including control columns and filters
     */
    private setUpControls(): void {
        //controls cols setup
        let controls_before = [] // control columns which occur before the main columns
        let controls_after = []; // control columns which occur after the main columns

        //selection setup
        if ("select" in this.config && this.config.select != "disabled") {
            if ("selectionModel" in this.config) {
                this.selection = this.config.selectionModel;
            } else {
                this.selection = new SelectionModel<string>(this.config.select == "many");
            }
            controls_before.unshift("select") // add select column to view
        }

        // open-dialog icon setup
        if (this.config.clickBehavior && this.config.clickBehavior == "dialog") {
            controls_after.push("open-dialog")
        }

        // open-link icon setup
        if (this.config.clickBehavior && this.config.clickBehavior == "linkToObjectRef") {
            controls_after.push("open-link")
        }

        // row action setup
        if (this.config.rowAction) {
            if (this.config.rowAction.position == "start") controls_before.push("start-action");
            else controls_after.push("end-action");
        }
        this.tableColumns_controls = controls_before.concat(this.tableColumns, controls_after);

        let filterList = this.config.filterList ? this.config.filterList : ['state', 'workflow_status'];
        if (filterList.includes('workflow_status')) {
            this.filterOptions.push({
                "name": "workflow status",
                "disabled": "status" in this.config,
                "values": this.statuses
            })
        }
        if (filterList.includes('state') && filterList.includes('state_exclusive')) {
          filterList = filterList.filter((obj)=>obj!='state_exclusive');
          logger.error("Cannot have both 'state' and 'state_exclusive' filters active.  Defaulting to 'state'");
        }
        if (filterList.includes('state')) {
            this.filterOptions.push({
                "name": "state",
                "disabled": "status" in this.config,
                "values": this.states
            })
        }
        if (filterList.includes('state_exclusive')) {
          this.filterOptions.push({
            "name": "state (exclusive)",
            "disabled": "status" in this.config,
            "values": this.statesExclusive,
          })
        }
        let filterByDomain: boolean = this.config.type ? ['data-source', 'mitigation', 'software', 'tactic', 'technique'].includes(this.config.type) : false;
        let filterByPlatform: boolean = this.config.type ? ['data-source', 'software', 'technique'].includes(this.config.type) : false;
        if (filterByDomain) {
            this.filterOptions.push({
                "name": "domain",
                "disabled": "status" in this.config,
                "values": this.domains
            })
        }
        if (filterByPlatform) {
            // only build platform filters if config.type is defined and object has 'x_mitre_platforms' field
            let platforms: FilterValue[] = this.buildPlatformFilter(this.config.type);
            if (platforms.length) {
                this.filterOptions.push({
                    "name": "platform",
                    "disabled": "status" in this.config,
                    "values": platforms
                })
            }
        }

        // get data from config (if we are not connecting to back-end)
        if ("stixObjects" in this.config && !(this.config.stixObjects instanceof Observable)) {
            this.totalObjectCount = this.config.stixObjects.length;
            this.applyControls();
        }
    }

    /**
     * Add a column to the table
     * @param {string} label the label to display the field under; column name
     * @param {string} field the field to display
     * @param {string} display how to format the column data
     * @param {boolean} [sticky] is the column sticky? If true, the column will be static in the X scrolling of the view
     * @param {string[]} [classes] list of css classes to apply to the cell
     */
    private addColumn(label: string, field: string, display: "version" | "list" | "plain" | "timestamp" | "descriptive" | "relationship_name" | "icon", sticky?: boolean, classes?: string[]) {
        this.tableColumns.push(field);
        this.tableColumns_settings.set(field, { label, display, sticky, classes });
    }

    /**
     * Add version, modified, and created columns to the table
     */
    private addVersionsAndDatesColumns() {
        this.addColumn("version", "version", "version");
        this.addColumn("modified", "modified", "timestamp");
        this.addColumn("created", "created", "timestamp");
    }

    public openUserSelectModal(): void {
        const select = new SelectionModel<string>(true);
        for (let i = 0; i < this.userIdsUsedInSearch.length; i++) {
            select.toggle(this.userIdsUsedInSearch[i]);

        }
        let prompt = this.dialog.open(AddDialogComponent, {
            data: {
                select,
                type: 'user',
                buttonLabel: "SEARCH",
                title: "Select users to filter by",
                clearSelection: true,
            },
            minHeight: "50vh",
            maxHeight: "75vh"
        })
        let subscription = prompt.afterClosed().subscribe({
            next: result => {
                if (result) {
                    this.userIdsUsedInSearch = select.selected;
                    this.applyControls();
                }
            },
            complete: () => { subscription.unsubscribe(); }
        });
    }

    /**
     * Handles row click events. Open the panel, or open a modal depending on object type
     * @param {StixObject} object of the row that was clicked
     */
    public rowClick(element: StixObject) {
        if (this.config.clickBehavior && this.config.clickBehavior == "none") return;
        if (this.config.clickBehavior && this.config.clickBehavior == "dialog") { //open modal
            let prompt = this.dialog.open(StixDialogComponent, {
                data: {
                    object: element,
                    editable: this.config.allowEdits,
                    sidebarControl: this.config.allowEdits ? "events" : "disable"
                },
                maxHeight: "75vh"
            })
            let subscription = prompt.afterClosed().subscribe({
                next: result => {
                    if (prompt.componentInstance.dirty) { //re-fetch values since an edit occurred
                        this.applyControls();
                        this.refresh.emit();
                    }
                },
                complete: () => { subscription.unsubscribe(); }
            });
        }
        else if (this.config.clickBehavior && this.config.clickBehavior == "linkToSourceRef") {
            let source_ref = element['source_ref'];
            // Get type to navigate from source_ref
            let type = this.typeMap[source_ref.split('--')[0]];

            this.router.navigateByUrl('/' + type + '/' + source_ref);
        }
        else if (this.config.clickBehavior && this.config.clickBehavior == "linkToTargetRef") {
            let target_ref = element['target_ref'];
            // Get type to navigate from target_ref
            let type = this.typeMap[target_ref.split('--')[0]];
            this.router.navigateByUrl('/' + type + '/' + target_ref);
        }
        else if (this.config.clickBehavior && this.config.clickBehavior == "linkToObjectRef") {
            // technically a note can be linked to many objects, we will select the first object
            let object_ref = element['object_refs'][0];
            // Get type to navigate from target_ref
            let type = this.typeMap[object_ref.split('--')[0]];

            this.sidebarService.opened = true;
            this.sidebarService.currentTab = 'notes';

            // collection objs have a different URL structure
            let url = `/${type}/${object_ref}`;
            if (type === 'collection') {
                const collectionSub = this.restAPIConnectorService.getCollection(object_ref).subscribe({
                    next: (result) => {
                        url = `${url}/modified/${result[0].modified.toISOString()}`;
                        this.router.navigateByUrl(url);
                    },
                    complete: () => { collectionSub.unsubscribe(); }
                });
            } else {
                this.router.navigateByUrl(url);
            }

        }
        else { //expand
            this.expandedElement = this.expandedElement === element ? null : element;
        }
    }

    // AUTHENTICATION FUNCTIONS

    public getAccessibleRoutes(attackType: string, routes: any[],) {
        return routes.filter(route => this.canAccess(attackType, route) && this.canEdit(route));
    }

    private canAccess(attackType: string, route: any) {
        if (route.label && route.label == 'edit' && !this.authenticationService.canEdit(attackType)) {
            // user not authorized
            return false;
        }
        // user authorized
        return true;
    }

    private canEdit(route: any) {
        if (route.label && route.label == 'edit' && this.config.uneditableObject) {
            return false;
        }
        return true;
    }

    /**
     * Filter the given objects to those which include the query. Searches all string and string[] properties
     * @template T the input type
     * @param {string} query
     * @param {T[]} objects
     * @returns {T[]}
     * @memberof StixListComponent
     */
    private filterObjects<T>(query: string, objects: T[]): T[] {
        return objects.filter(obj => {
            return Object.keys(obj).some(key => {
                if (typeof obj[key] === 'string') return obj[key].toLowerCase().includes(query.toLowerCase())
                else if (Array.isArray(obj[key])) {
                    return obj[key].some(val => {
                        if (typeof (val) === 'string') {
                            return val.toLowerCase().includes(query.toLowerCase());
                        }
                    })
                }
            })
        })
    }

    /**
     * Enable all filters for the given filter name
     * @param {string} name name of the filter group 
     */
    private enableAllFilters(name: string) {
        for (let group of this.filterOptions) {
            if (group.name == name) {
                group.values.forEach(option => option.disabled = false);
            }
        }
    }

    /**
     * Build platform filter values for the given attack type
     */
    private buildPlatformFilter(attackType: string): FilterValue[] {
        let platforms: FilterValue[] = [];
        let domainMap = this.platformMap.get(attackType);
        if (domainMap) {
            // add platforms related to this attackType
            let values: Set<string> = new Set();
            for (let platforms of domainMap.values()) {
                platforms.forEach(platform => values.add(platform));
            }
            for (let value of values) {
                platforms.push({
                    "value": `platform.${value}`,
                    "label": value,
                    "disabled": false
                });
            }
        }
        return platforms;
    }

    /**
     * Disable platform filters which are not in the list of selected domains.
     * All other platforms will be marked as enabled.
     * @param domains list of selected domain filters
     */
    private disablePlatformFilters(domains: string[]): void {
        if (!domains.length) return;
        // get set of valid platforms in the selected domains
        let validPlatforms: Set<string> = new Set();
        let domainMap = this.platformMap.get(this.config.type);
        if (!domainMap) return; // platforms not supported for this attack type
        for (let domain of domains) {
            let platforms = domainMap.get(domain);
            if (platforms) {
                platforms.forEach(p => validPlatforms.add(p));
            }
        }
        // set enabledness of platform filters
        for (let group of this.filterOptions) {
            if (group.name == 'platform') {
                for (let option of group.values) {
                    let platform = option.value.split("platform.")[1];
                    // disable platform filters not in the list of valid platforms
                    option.disabled = !validPlatforms.has(platform);
                }
            }
        }
    }

    /**
     * Disable domain filters which do not support the list of selected platforms.
     * All other domains will be marked as enabled.
     * @param platforms list of selected platform filters
     */
    private disableDomainFilters(platforms: string[]): void {
        if (!platforms.length) return;
        // get set of domains the selected platforms are supported by
        let validDomains: Set<string> = new Set();
        let domainMap = this.platformMap.get(this.config.type);
        if (!domainMap) return; // domains not supported for this attack type
        for (let [domain, domainPlatforms] of domainMap.entries()) {
            // get intersection of selected platforms and the domain platforms
            let filtered = domainPlatforms.filter(p => platforms.includes(p));
            if (filtered.length) validDomains.add(domain);
        }
        // set enabledness of domain filters
        for (let group of this.filterOptions) {
            if (group.name == 'domain') {
                for (let option of group.values) {
                    let domain = option.value.split("domain.")[1];
                    // disable domain filters not in the list of valid domains
                    option.disabled = !validDomains.has(domain);
                }
            }
        }
    }

    /**
     * Apply all controls and fetch objects from the back-end if configured
     */
    public applyControls() {
        const {deprecated, revoked, state, platforms, domains, exclusiveDeprecated, exclusiveRevoked} = this.getFilterObjectStates();
        if ("stixObjects" in this.config) {
            if (this.config.stixObjects instanceof Observable) {
                // pull objects out of observable
            } else {
                // filter on STIX objects specified in the config
                let filtered = this.config.stixObjects;

                //filter by domains
                if (Array.isArray(domains) && domains.length > 0) {
                  filtered = filtered.filter((obj:any)=> obj.domains.some((object_domain: any) => domains.includes(object_domain)));
                }

                //filter by platforms
                if (Array.isArray(platforms) && platforms.length > 0) {
                  filtered = filtered.filter((obj:any)=> obj.platforms.some((object_platform: any) => platforms.includes(object_platform)));
                }
                
                // filter by workflow status
                if (state) {
                  filtered = filtered.filter((obj:any)=> obj.workflow && obj.workflow.state == state)
                }

                // filter by deprecation status
                if (exclusiveDeprecated) {
                  filtered = filtered.filter((obj:any)=> obj.deprecated)
                }

                // filter by deprecation status
                if (exclusiveRevoked) {
                  filtered = filtered.filter((obj:any)=> obj.revoked)
                }

                //filter by users
                if (Array.isArray(this.userIdsUsedInSearch) && this.userIdsUsedInSearch.length > 0) {
                  filtered = filtered.filter((obj:any)=> obj.workflow && this.userIdsUsedInSearch.includes(obj.workflow.created_by_user_account));
                }

                // filter to objects matching searchString
                filtered = this.filterObjects(this.searchQuery, filtered);
                // sort
                filtered = filtered.sort((a, b) => {
                    let x = a as any;
                    let y = b as any;
                    return x.hasOwnProperty("name") && y.hasOwnProperty("name") ? x.name.localeCompare(y.name) : x.stixID.localeCompare(y.stixID)
                })
                if (this.paginator) this.totalObjectCount = filtered.length;

                // filter to only ones within the correct index range
                let startIndex = this.paginator ? this.paginator.pageIndex * this.paginator.pageSize : 0
                let endIndex = this.paginator ? startIndex + this.paginator.pageSize : 10;
                filtered = filtered.slice(startIndex, endIndex);
                this.data$ = of({
                    data: filtered,
                    pagination: {
                        total: this.config.stixObjects.length,
                        offset: startIndex,
                        limit: this.paginator ? this.paginator.pageSize : 0
                    }
                });
            }
        } else {
            // fetch objects from backend
            let limit = this.paginator ? this.paginator.pageSize : 10;
            let offset = this.paginator ? this.paginator.pageIndex * limit : 0;

            let options = {
                limit: limit,
                offset: offset,
                excludeIDs: this.config.excludeIDs,
                search: this.searchQuery,
                state: state,
                includeRevoked: revoked,
                includeDeprecated: deprecated,
                platforms: platforms,
                domains: domains,
                lastUpdatedBy: this.userIdsUsedInSearch,
            }
            if (this.config.type == "software") this.data$ = this.restAPIConnectorService.getAllSoftware(options);
            else if (this.config.type == "campaign") this.data$ = this.restAPIConnectorService.getAllCampaigns(options);
            else if (this.config.type == "group") this.data$ = this.restAPIConnectorService.getAllGroups(options);
            else if (this.config.type == "matrix") this.data$ = this.restAPIConnectorService.getAllMatrices(options);
            else if (this.config.type == "mitigation") this.data$ = this.restAPIConnectorService.getAllMitigations(options);
            else if (this.config.type == "tactic") this.data$ = this.restAPIConnectorService.getAllTactics(options);
            else if (this.config.type == "technique") this.data$ = this.restAPIConnectorService.getAllTechniques(options);
            else if (this.config.type.includes("collection")) this.data$ = this.restAPIConnectorService.getAllCollections({ search: this.searchQuery, versions: "all" });
            else if (this.config.type == "relationship") this.data$ = this.restAPIConnectorService.getRelatedTo({ sourceRef: this.config.sourceRef, targetRef: this.config.targetRef, sourceType: this.config.sourceType, targetType: this.config.targetType, relationshipType: this.config.relationshipType, excludeSourceRefs: this.config.excludeSourceRefs, excludeTargetRefs: this.config.excludeTargetRefs, limit: limit, offset: offset, includeDeprecated: deprecated });
            else if (this.config.type == "data-source") this.data$ = this.restAPIConnectorService.getAllDataSources(options);
            else if (this.config.type == "data-component") this.data$ = this.restAPIConnectorService.getAllDataComponents(options);
            else if (this.config.type == "marking-definition") this.data$ = this.restAPIConnectorService.getAllMarkingDefinitions(options);
            else if (this.config.type == "note") this.data$ = this.restAPIConnectorService.getAllNotes(options);
            let subscription = this.data$.subscribe({
                next: (data) => { this.totalObjectCount = data.pagination.total; },
                complete: () => { subscription.unsubscribe() }
            });
        }
    }

    public showDeprecated(event) {
        if (event.checked) {
            this.filter.push("state.deprecated");
        } else {
            let i = this.filter.indexOf("state.deprecated");
            if (i >= 0) {
                this.filter.splice(i, 1);
            }
        }
        this.applyControls();
    }

    public ngOnDestroy() {
        // prevent memory leaks
        if (this.searchSubscription) this.searchSubscription.unsubscribe();
        if (this.platformSubscription) this.platformSubscription.unsubscribe();
    }

    /**
     * Captures the filter statuses and returns them as an object.
     */
    private getFilterObjectStates() {
      let deprecated = this.filter.includes("state.deprecated");
      let revoked = this.filter.includes("state.revoked");

      // exclusive deprecated filter
      let exclusiveDeprecated = this.filter.includes("state.exclusive.deprecated");
      // exclusive revoked filter
      let exclusiveRevoked = this.filter.includes("state.exclusive.revoked");

      // state exclusive logic
      if (exclusiveDeprecated || exclusiveRevoked) {
        const search = exclusiveDeprecated ? 'state.exclusive.revoked' : 'state.exclusive.deprecated';
        for (let group of this.filterOptions) {
          for (let option of group.values) {
              if (option.value == search) option.disabled = true;
          }
        }
      } else {
        this.enableAllFilters('state (exclusive)');
      }

      // state filter
      let state = this.filter.find((x) => x.startsWith("status."));
      if (state) {
        state = state.split("status.")[1];
        // disable other states
        for (let group of this.filterOptions) {
            for (let option of group.values) {
                if (option.value.startsWith("status.") && !option.value.endsWith(state)) option.disabled = true;
            }
        }
      } else {
          // enable all states
          this.enableAllFilters('workflow status');
      }

      // platform filter
      let platforms: string[] = this.filter.filter((x) => x.startsWith("platform."));
      if (platforms.length) {
          platforms = platforms.map(p => p.split("platform.")[1]);
          // disable domains that do not support selected platforms
          this.disableDomainFilters(platforms);
      } else {
          // enable all domains
          this.enableAllFilters('domain');
      }

      // domain filter
      let domains: string[] = this.filter.filter((x) => x.startsWith("domain."));
      if (domains.length) {
          domains = domains.map(d => d.split("domain.")[1]);
          // disable platforms not in selected domains
          this.disablePlatformFilters(domains);
      } else {
          // enable all platforms
          this.enableAllFilters('platform');
      }
      return {
        deprecated,
        revoked,
        state,
        platforms,
        domains,
        exclusiveDeprecated,
        exclusiveRevoked,
      };
    }
}

//allowed types for StixListConfig
type type_attacktype = "collection" | "campaign" | "group" | "matrix" | "mitigation" | "software" | "tactic" | "technique" | "relationship" | "data-source" | "data-component" | "marking-definition" | "note";
type selection_types = "one" | "many" | "disabled";
type filter_types = "state" | "workflow_status";
export interface StixListConfig {
    /* if specified, shows the given STIX objects in the table instead of loading from the back-end based on other configurations. */
    stixObjects?: Observable<StixObject[]> | StixObject[];

    /** STIX ID;s force the list to show relationships with the given source or target. Use with type=='relationship' */
    sourceRef?: string;
    targetRef?: string;
    /** ATT&CK Types force the list to show relationships only with those types, use with type == 'relationship' */
    sourceType?: type_attacktype;
    targetType?: type_attacktype;
    /** relationship type to get, use with type=='relationship' */
    relationshipType?: string;

    /** force the list to show only this type */
    type?: type_attacktype | "collection-created" | "collection-imported";
    /** force the list to show only objects matching this query */
    query?: any;

    /** can the user select in this list? allowed options:
     *     "one": user can select a single element at a time
     *     "many": user can select as many elements as they want
     *     "disabled": do not allow selection (the same as omitting the config field)
     */
    select?: selection_types;
    /**
     * If provided, use this selection model of STIX IDs for tracking selection
     * Only relevant if 'select' is also enabled. Also, will cause problems if multiple constructor pram is set according to 'select'.
     */
    selectionModel?: SelectionModel<string>;
    /** show links to view/edit pages for relevant objects? */
    showLinks?: boolean;
    /** default true, if false hides the filter dropdown menu */
    showFilters?: boolean;
    /** display the 'show deprecated' filter, default false
     *  this may be relevant when displaying a list of embedded relationships, where
     *  the list of STIX objects is provided in the 'stixObjects' configuration
     */
    showDeprecatedFilter?: boolean;
    /** default ['state','workflow_status'], if decides which filters to show */
    filterList?: Array<filter_types>;
    /** default: false, if false hides the user search in the filters*/
    showUserSearch?: boolean;
    /**
     * How should the table act when the row is clicked? default "expand"
     *     "expand": expand the row to show additional detail
     *     "dialog": open a dialog with the full object definition
     *     "linkToSourceRef": clicking redirects to the source ref object
     *     "linkToTargetRef": clicking redirects user to target ref object
     *     "linkToObjectRef": clicking redirects user to first object in the object ref array
     *     "none": row is not clickable
     */
    clickBehavior?: "expand" | "dialog" | "linkToSourceRef" | "linkToTargetRef" | "linkToObjectRef" | "none";
    /**
     * Default false. If true, allows for edits of the objects in the table
     * when in dialog mode
     */
    allowEdits?: boolean;

    /**
     * Default false. If true, edits will be disabled for the object
     */
    uneditableObject?: boolean;

    excludeIDs?: string[]; //exclude objects with this ID from the list
    excludeSourceRefs?: string[]; //exclude relationships with this source_ref from the list
    excludeTargetRefs?: string[]; //exclude relationships with this target_ref from the list

    // if specified, adds an action button for each row
    rowAction?: {
        icon: string, // material icon for the button
        tooltip: string, // tooltip or descriptor of action
        position: "start" | "end" //start: occurs before first column; end: occurs after last column
    }

    /**
     * Map of collections by stixID
     */
    collectionMap?: Map<string, Collection[]>;
}

export interface FilterValue {
    value: string;
    label: string;
    disabled: boolean;
}
export interface FilterGroup {
    disabled?: boolean; //is the entire group disabled
    name: string;
    values: FilterValue[];
}