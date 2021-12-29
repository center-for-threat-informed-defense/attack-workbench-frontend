import { Component, OnInit, Input, ViewEncapsulation, ViewChild, AfterViewInit, ElementRef, EventEmitter, Output, OnDestroy } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

import { SelectionModel } from '@angular/cdk/collections';
import { StixDialogComponent } from '../../../views/stix/stix-dialog/stix-dialog.component';

import { MatDialog } from '@angular/material/dialog';
import { fromEvent, Observable, of, Subscription } from 'rxjs';
import { Paginated, RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';

@Component({
    selector: 'app-stix-list',
    templateUrl: './stix-list.component.html',
    styleUrls: ['./stix-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger("detailExpand", [
            transition(":enter", [
                style({ height: '0px', minHeight: '0px'}),
                animate("100ms cubic-bezier(0.4, 0.0, 0.2, 1)", style({height: '*'}))
            ]),
            transition(':leave', [
                animate('100ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ height: '0px', minHeight: '0px' }))
            ])
        ]),
        trigger("fadeIn", [
            transition(":enter", [
                style({ opacity: 0 }),
                animate("500ms cubic-bezier(0.4, 0.0, 0.2, 1)", style({opacity: '1'}))
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
    public searchQuery: string = "";
    private searchSubscription: Subscription;

    //objects to render;
    public objects$: Observable<StixObject[]>;
    public data$: Observable<Paginated<StixObject>>;
    public totalObjectCount: number = 0;
    //view mode
    public mode: string = "cards";
    //options provided to the user for grouping and filtering
    public filterOptions: FilterGroup[] = [];
    //current grouping and filtering selections
    public filter: string[] = [];
    public groupBy: string[] = [];
    // search query

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
        "x-mitre-collection": "collection",
        "attack-pattern": "technique",
        "malware": "software",
        "tool": "software",
        "intrusion-set": "group",
        "course-of-action": "mitigation",
        "x-mitre-matrix": "matrix",
        "x-mitre-tactic": "tactic",
        "relationship": "relationship"
    }

    // Route authentication
    public getAccessibleRoutes(routes: any[]) {
        return routes.filter(route => this.canAccess(route));
    }
    private canAccess(route: any) {
        if (route.label && route.label == 'edit' && !this.authenticationService.canEdit()) {
            // user not authorized
            return false;
        }
        // user authorized
        return true;
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
        this.tableColumns_settings.set(field, {label, display, sticky, classes});
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
                    sidebarControl: this.config.allowEdits? "events" : "disable"
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

            this.router.navigateByUrl('/'+ type + '/' + target_ref);
        }
        else { //expand
            this.expandedElement = this.expandedElement === element ? null : element;
        }
    }
    

    //all possible each type of filter/groupBy
    // private types: FilterValue[] = [
    //     {"value": "type.group", "label": "group", "disabled": false},
    //     {"value": "type.matrix", "label": "matrix", "disabled": false},
    //     {"value": "type.mitigation", "label": "mitigation", "disabled": false},
    //     {"value": "type.software", "label": "software", "disabled": false},
    //     {"value": "type.tactic", "label": "tactic", "disabled": false},
    //     {"value": "type.technique", "label": "technique", "disabled": false},
    // ]
    // private domains: FilterValue[] = [
    //     {"value": "domain.enterprise-attack", "label": "enterprise", "disabled": false},
    //     {"value": "domain.mobile-attack", "label": "mobile", "disabled": false}
    // ]
    private statuses: FilterValue[] = [
        {"value": "status.work-in-progress", "label": "show only work in progress", "disabled": false},
        {"value": "status.awaiting-review", "label": "show only awaiting review", "disabled": false},
        {"value": "status.reviewed", "label": "show only reviewed", "disabled": false}
    ]
    private states: FilterValue[] = [
        {"value": "state.deprecated", "label": "include deprecated", "disabled": false},
        {"value": "state.revoked", "label": "include revoked", "disabled": false}
    ]

    constructor(public dialog: MatDialog, private restAPIConnectorService: RestApiConnectorService, private router: Router, private authenticationService: AuthenticationService) {}
    
    ngOnInit() {
        this.filterOptions = []
        // parse the config
        let controls_before = [] // control columns which occur before the main columns
        let controls_after = []; // control columns which occur after the main columns
        let sticky_allowed = !(this.config.rowAction && this.config.rowAction.position == "start");
        if ("type" in this.config) { 
            // this.filter.push("type." + this.config.type); 
            // set columns according to type
            switch(this.config.type.replace(/_/g, '-')) {
                case "collection":
                case "collection-created":
                    this.addColumn("name", "name", "plain", sticky_allowed, ["name"]);
                    this.addColumn("version", "version", "version");
                    this.addColumn("released?", "release", "plain", null, ["text-label"]);
                    this.addColumn("modified", "modified", "timestamp");
                    this.addColumn("created", "created", "timestamp");
                    this.tableDetail = [{
                        "field": "description",
                        "display": "descriptive"
                    }]
                    break;
                case "collection-imported":
                    this.addColumn("name", "name", "plain", sticky_allowed, ["name"]);
                    this.addColumn("version", "version", "version");
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
                    this.addColumn("version", "version", "version");
                    this.addColumn("modified","modified", "timestamp");
                    this.addColumn("created", "created", "timestamp");
                    this.tableDetail = [{
                        "field": "description",
                        "display": "descriptive"
                    }]
                    break;
                case "matrix":
                    this.addColumn("", "workflow", "icon");
                    this.addColumn("", "state", "icon");
                    this.addColumn("name", "name", "plain", sticky_allowed, ["name"]);
                    this.addColumn("version", "version", "version");
                    this.addColumn("modified","modified", "timestamp");
                    this.addColumn("created", "created", "timestamp");
                    this.tableDetail = [{
                        "field": "description",
                        "display": "descriptive"
                    }]
                    break;
                case "group":
                    this.addColumn("", "workflow", "icon");
                    this.addColumn("", "state", "icon");
                    this.addColumn("ID", "attackID", "plain", false);
                    this.addColumn("name", "name", "plain", sticky_allowed, ["name"]);
                    this.addColumn("associated groups", "aliases", "list");
                    this.addColumn("version", "version", "version");
                    this.addColumn("modified","modified", "timestamp");
                    this.addColumn("created", "created", "timestamp");
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
                    this.addColumn("version", "version", "version");
                    this.addColumn("modified","modified", "timestamp");
                    this.addColumn("created", "created", "timestamp");
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
                    this.addColumn("version", "version", "version");
                    this.addColumn("modified","modified", "timestamp");
                    this.addColumn("created", "created", "timestamp");
                    this.tableDetail = [{
                        "field": "description",
                        "display": "descriptive"
                    }]
                    break;
                case "data-component":
                    this.addColumn("name", "name", "plain", sticky_allowed, ["name"]);
                    this.addColumn("domain", "domains", "list");
                    this.addColumn("version", "version", "version");
                    this.addColumn("modified","modified", "timestamp");
                    this.addColumn("created", "created", "timestamp");
                    this.tableDetail = [{
                        "field": "description",
                        "display": "descriptive"
                    }]
                    break;
                case "relationship":
                    this.addColumn("", "state", "icon");
                    if (this.config.relationshipType && this.config.relationshipType !== "detects") {
                        this.addColumn("source", "source_ID", "plain");
                        this.addColumn("", "source_name", "plain", this.config.targetRef? sticky_allowed: false, ["relationship-name"]);// ["name", "relationship-left"]);
                    } else this.addColumn("source", "source_name", "plain", this.config.targetRef? sticky_allowed: false, ["relationship-name"]);
                    this.addColumn("type", "relationship_type", "plain", false, ["text-deemphasis", "relationship-joiner"]);
                    this.addColumn("target", "target_ID", "plain");
                    this.addColumn("", "target_name", "plain", this.config.sourceRef? sticky_allowed: false, ["relationship-name"]);// ["name", "relationship-right"]);
                    if (!(this.config.relationshipType && this.config.relationshipType == "subtechnique-of")) this.addColumn("description", "description", "descriptive", false);
                    // controls_after.push("open-link")
                    break;
                default:
                    this.addColumn("type", "attackType", "plain");
                    this.addColumn("modified","modified", "timestamp");
                    this.addColumn("created", "created", "timestamp");
            }
        }
        else {
            // this.filterOptions.push({
            //     "name": "type", //TODO make more extensible to additional types
            //     "disabled": "type" in this.config,
            //     "values": this.types
            // })
            this.groupBy = ["type"];
            this.addColumn("type", "attackType", "plain");
            this.addColumn("ID", "attackID", "plain", false);
            this.addColumn("name", "name", "plain", true, ["name"]);
            this.addColumn("modified","modified", "timestamp");
            this.addColumn("created", "created", "timestamp");
        }
        
        
        if ("relatedTo" in this.config) {
            
        } 
        if ("query" in this.config) {
            
        }
        //controls cols setup
        //selection setup
        if ("select" in this.config && this.config.select != "disabled") {
            if ("selectionModel" in this.config) {
                this.selection = this.config.selectionModel;
            } else {
                this.selection = new SelectionModel<string>(this.config.select == "many");
            }
            controls_before.unshift("select") // add select column to view
        }
        // open-link icon setup
        if (this.config.clickBehavior && this.config.clickBehavior == "dialog") {
            controls_after.push("open-link")
        }
        // row action setup
        if (this.config.rowAction) {
            if (this.config.rowAction.position == "start") controls_before.push("start-action");
            else controls_after.push("end-action");
        }
        this.tableColumns_controls = controls_before.concat(this.tableColumns, controls_after);
        // filter setup
        this.filterOptions.push({
            "name": "workflow status",
            "disabled": "status" in this.config,
            "values": this.statuses
        })
        this.filterOptions.push({
            "name": "state",
            "disabled": "status" in this.config,
            "values": this.states
        })
        // get data from config (if we are not connecting to back-end)
        if ("stixObjects" in this.config && !(this.config.stixObjects instanceof Observable)) {
            this.totalObjectCount = this.config.stixObjects.length;
            this.applyControls();
        }
    }

    ngAfterViewInit() {
        // get objects from backend if data is not from config
        if (!("stixObjects" in this.config)) this.applyControls();
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
                        if (typeof(val) === 'string') {
                            return val.toLowerCase().includes(query.toLowerCase());
                        }
                    })
                }
            })
        })
    }

    /**
     * Apply all controls and fetch objects from the back-end if configured
     */
    public applyControls() {
        if ("stixObjects" in this.config) {
            if (this.config.stixObjects instanceof Observable) {
                // pull objects out of observable
            } else {
                // no need to pull objects out of observable
                
                // set max length for paginator
                // this.paginator.length = this.config.stixObjects.length;
                // filter on STIX objects specified in the config
                let filtered = this.config.stixObjects;
                // filter to objects matching searchString
                filtered = this.filterObjects(this.searchQuery, filtered); 
                // sort
                filtered = filtered.sort((a, b) => {
                    let x = a as any;
                    let y = b as any;
                    return x.hasOwnProperty("name") && y.hasOwnProperty("name")? x.name.localeCompare(y.name) : x.stixID.localeCompare(y.stixID)
                })
                if (this.paginator) this.totalObjectCount = filtered.length;
                
                // filter to only ones within the correct index range
                let startIndex = this.paginator? this.paginator.pageIndex * this.paginator.pageSize : 0
                let endIndex = this.paginator? startIndex + this.paginator.pageSize : 10;
                filtered = filtered.slice(startIndex, endIndex);
                this.data$ = of({
                    data: filtered,
                    pagination: {
                        total: this.config.stixObjects.length,
                        offset: startIndex,
                        limit: this.paginator? this.paginator.pageSize : 0
                    }
                });
                // this.objects$ = of(filtered);
            }
        } else {
            // fetch objects from backend
            let limit = this.paginator? this.paginator.pageSize : 10;
            let offset = this.paginator? this.paginator.pageIndex * limit : 0;
            let deprecated = this.filter.includes("state.deprecated");
            let revoked = this.filter.includes("state.revoked");
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
                for (let group of this.filterOptions) {
                    for (let option of group.values) {
                        if (option.value.startsWith("status.")) option.disabled = false;
                    }
                }
            }
            
            let options = {
                limit: limit, 
                offset: offset, 
                excludeIDs: this.config.excludeIDs, 
                search: this.searchQuery, 
                state: state, 
                includeRevoked: revoked, 
                includeDeprecated: deprecated
            }

            if (this.config.type == "software") this.data$ = this.restAPIConnectorService.getAllSoftware(options);
            else if (this.config.type == "group") this.data$ = this.restAPIConnectorService.getAllGroups(options);
            else if (this.config.type == "matrix") this.data$ = this.restAPIConnectorService.getAllMatrices(options);
            else if (this.config.type == "mitigation") this.data$ = this.restAPIConnectorService.getAllMitigations(options);
            else if (this.config.type == "tactic") this.data$ = this.restAPIConnectorService.getAllTactics(options);
            else if (this.config.type == "technique") this.data$ = this.restAPIConnectorService.getAllTechniques(options);
            else if (this.config.type.includes("collection")) this.data$ = this.restAPIConnectorService.getAllCollections({search: this.searchQuery, versions: "all"});
            else if (this.config.type == "relationship") this.data$ = this.restAPIConnectorService.getRelatedTo({sourceRef: this.config.sourceRef, targetRef: this.config.targetRef, sourceType: this.config.sourceType, targetType: this.config.targetType, relationshipType: this.config.relationshipType,  excludeSourceRefs: this.config.excludeSourceRefs, excludeTargetRefs: this.config.excludeTargetRefs, limit: limit, offset: offset, includeDeprecated: deprecated});
            else if (this.config.type == "data-source") this.data$ = this.restAPIConnectorService.getAllDataSources(options);
            else if (this.config.type == "data-component") this.data$ = this.restAPIConnectorService.getAllDataComponents(options);
            let subscription = this.data$.subscribe({
                next: (data) => { this.totalObjectCount = data.pagination.total; },
                complete: () => { subscription.unsubscribe() }
            })
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
        if (this.searchSubscription) this.searchSubscription.unsubscribe();
    }
}

//allowed types for StixListConfig
type type_attacktype = "collection" | "group" | "matrix" | "mitigation" | "software" | "tactic" | "technique" | "relationship" | "data-source" | "data-component";
type selection_types = "one" | "many" | "disabled"
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
    /**
     * How should the table act when the row is clicked? default "expand"
     *     "expand": expand the row to show additional detail
     *     "dialog": open a dialog with the full object definition
     *     "linkToSourceRef": clicking redirects to the source ref object
     *     "linkToTargetRef": clicking redirects user to target ref object
     *     "none": row is not clickable
     */
    clickBehavior?: "expand" | "dialog" | "linkToSourceRef" | "linkToTargetRef" | "none";
    /**
     * Default false. If true, allows for edits of the objects in the table
     * when in dialog mode
     */
    allowEdits?: boolean;
    
    excludeIDs?: string[]; //exclude objects with this ID from the list
    excludeSourceRefs?: string[]; //exclude relationships with this source_ref from the list
    excludeTargetRefs?: string[]; //exclude relationships with this target_ref from the list

    // if specified, adds an action button for each row
    rowAction?: {
        icon: string, // material icon for the button
        tooltip: string, // tooltip or descriptor of action
        position: "start" | "end" //start: occurs before first column; end: occurs after last column
    }
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