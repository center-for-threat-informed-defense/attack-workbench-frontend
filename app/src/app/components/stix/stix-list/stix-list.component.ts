import { Component, OnInit, Input, ViewEncapsulation, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';
import {animate, style, transition, trigger} from '@angular/animations';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

import { SelectionModel } from '@angular/cdk/collections';
import { StixDialogComponent } from '../../../views/stix/stix-dialog/stix-dialog.component';

import { MatDialog } from '@angular/material/dialog';
import { fromEvent, Observable, of } from 'rxjs';
import { Paginated, RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

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
export class StixListComponent implements OnInit, AfterViewInit {


    // @Input() public stixObjects: StixObject[]; //TODO get rid of this in favor of stix list cards loading using filters
    @Input() public config: StixListConfig = {};
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('search') search: ElementRef;
    // @ViewChild(MatSort) public sort: MatSort;

    //objects to render;
    public objects$: Observable<StixObject[]>;
    public data$: Observable<Paginated>;
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

    /**
     * Add a column to the table
     * @param {string} label the label to display the field under; column name
     * @param {string} field the field to display
     * @param {string} display how to format the column data
     * @param {boolean} [sticky] is the column sticky? If true, the column will be static in the X scrolling of the view
     * @param {string[]} [classes] list of css classes to apply to the cell
     */
    private addColumn(label: string, field: string, display: "version" | "list" | "plain" | "timestamp" | "descriptive" | "relationship_name", sticky?: boolean, classes?: string[]) {
        this.tableColumns.push(field);
        this.tableColumns_settings.set(field, {label, display, sticky, classes});
    }

    /**
     * Handles row click events. Open the panel, or open a modal depending on object type
     * @param {StixObject} object of the row that was clicked
     */
    public onRowClick(element: StixObject) {
        if (this.config.clickBehavior && this.config.clickBehavior == "dialog") { //open modal
            this.dialog.open(StixDialogComponent, {
                data: {
                    object: element,
                    editable: true,
                    sidebarControl: "disable"
                },
                maxHeight: "75vh"
            });
        } else { //expand
            this.expandedElement = this.expandedElement === element ? null : element;
        }
    }
    

    //all possible each type of filter/groupBy
    private types: FilterValue[] = [
        {"value": "type.group", "label": "group"},
        {"value": "type.matrix", "label": "matrix"},
        {"value": "type.mitigation", "label": "mitigation"},
        {"value": "type.software", "label": "software"},
        {"value": "type.tactic", "label": "tactic"},
        {"value": "type.technique", "label": "technique"},
    ]
    private domains: FilterValue[] = [
        {"value": "domain.enterprise-attack", "label": "enterprise"},
        {"value": "domain.mobile-attack", "label": "mobile"}
    ]
    private collections: FilterValue[];
    private statuses: FilterValue[] = [
        {"value": "status.wip", "label": "work in progress"},
        {"value": "status.awaiting-review", "label": "awaiting review"},
        {"value": "status.reviewed", "label": "reviewed"},
        {"value": "status.deprecated", "label": "deprecated"},
        {"value": "status.revoked", "label": "revoked"}
    ]

    constructor(public dialog: MatDialog, private restAPIConnectorService: RestApiConnectorService) {}
    ngOnInit() {
        this.filterOptions = []
        // parse the config
        let controls_before = [] // control columns which occur before the main columns
        let controls_after = []; // control columns which occur after the main columns
        if ("type" in this.config) { 
            this.filter.push("type." + this.config.type); 
            // set columns according to type
            switch(this.config.type) {
                case "collection":
                    this.addColumn("name", "name", "plain", true, ["name"]);
                    this.addColumn("highest version", "version", "version");
                    this.addColumn("imported", "imported", "timestamp");
                    this.addColumn("released", "modified", "timestamp");
                    this.tableDetail = [{
                        "field": "description",
                        "display": "descriptive"
                    }]
                    break;
                case "mitigation":
                case "tactic":
                    this.addColumn("ID", "attackID", "plain");
                case "matrix":
                    this.addColumn("name", "name", "plain", true, ["name"]);
                    this.addColumn("version", "version", "version");
                    this.addColumn("modified","modified", "timestamp");
                    this.addColumn("created", "created", "timestamp");
                    this.tableDetail = [{
                        "field": "description",
                        "display": "descriptive"
                    }]
                    break;
                case "group":
                    this.addColumn("ID", "attackID", "plain");
                    this.addColumn("name", "name", "plain", true, ["name"]);
                    this.addColumn("aliases", "aliases", "list");
                    this.addColumn("version", "version", "version");
                    this.addColumn("modified","modified", "timestamp");
                    this.addColumn("created", "created", "timestamp");
                    this.tableDetail = [{
                        "field": "description",
                        "display": "descriptive"
                    }]
                    break;
                case "software":
                    this.addColumn("ID", "attackID", "plain");
                    this.addColumn("name", "name", "plain", true, ["name"]);
                    this.addColumn("type", "type", "plain");
                    this.addColumn("version", "version", "version");
                    this.addColumn("modified","modified", "timestamp");
                    this.addColumn("created", "created", "timestamp");
                    this.tableDetail = [{
                        "field": "description",
                        "display": "descriptive"
                    }]
                    break;
                case "technique":
                    this.addColumn("ID", "attackID", "plain");
                    this.addColumn("name", "name", "plain", true, ["name"]);
                    this.addColumn("platforms", "platforms", "list");
                    this.addColumn("version", "version", "version");
                    this.addColumn("modified","modified", "timestamp");
                    this.addColumn("created", "created", "timestamp");
                    this.tableDetail = [{
                        "field": "description",
                        "display": "descriptive"
                    }]
                    break;
                case "relationship":
                    this.addColumn("source name", "source_name", "plain", this.config.targetRef? true : false);// ["name", "relationship-left"]);
                    this.addColumn("type", "relationship_type", "plain", false, ["text-deemphasis", "relationship-joiner"]);
                    this.addColumn("target name", "target_name", "plain", this.config.sourceRef? true : false);// ["name", "relationship-right"]);
                    this.addColumn("description", "description", "descriptive", false);
                    // controls_after.push("open-link")
                    break;
                default:
                    this.addColumn("type", "attacktype", "plain");
                    this.addColumn("modified","modified", "timestamp");
                    this.addColumn("created", "created", "timestamp");
            }

        }
        else {
            this.filterOptions.push({
                "name": "type", //TODO make more extensible to additional types
                "disabled": "type" in this.config,
                "values": this.types
            })
            this.groupBy = ["type"];
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
        this.tableColumns_controls = controls_before.concat(this.tableColumns, controls_after);
        // filter setup
        this.filterOptions.push({
            "name": "status",
            "disabled": "status" in this.config,
            "values": this.statuses
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
        fromEvent(this.search.nativeElement, 'keyup').pipe(
            filter(Boolean),
            debounceTime(250),
            distinctUntilChanged(),
            tap(_ => { 
                if (this.paginator) this.paginator.pageIndex = 0;
                this.applyControls();
            })
        ).subscribe()
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
                        if (typeof(val === 'string')) return val.toLowerCase().includes(query.toLowerCase());
                    })
                }
            })
        })
    }

    /**
     * Apply all controls and fetch objects from the back-end if configured
     */
    public applyControls() {
        let searchString = this.search? this.search.nativeElement.value : "";
        if ("stixObjects" in this.config) {
            if (this.config.stixObjects instanceof Observable) {
                // pull objects out of observable
            } else {
                // no need to pull objects out of observable
                
                // set max length for paginator
                // this.paginator.length = this.config.stixObjects.length;
                // filter on STIX objects specified in the config
                let filtered = this.config.stixObjects;
                filtered = this.filterObjects(searchString, filtered); 
                if (this.paginator) this.totalObjectCount = filtered.length;
                
                // filter to only ones within the correct index range
                let startIndex = this.paginator? this.paginator.pageIndex * this.paginator.pageSize : 0
                let endIndex = this.paginator? startIndex + this.paginator.pageSize : 5;
                // console.log(filtered, this.config.stixObjects);
                filtered = filtered.slice(startIndex, endIndex);
                // filter to objects matching searchString
                // console.log(startIndex, endIndex)
                this.data$ = of({
                    data: filtered,
                    pagination: {
                        total: this.config.stixObjects.length,
                        offset: startIndex,
                        limit: this.paginator? this.paginator.pageSize : 0
                    }
                });
                // this.objects$ = of(filtered);
                // console.log(this.objects$);
                // console.log(this.paginator);
            }
        } else {
            // fetch objects from backend
            let limit = this.paginator? this.paginator.pageSize : 5;
            let offset = this.paginator? this.paginator.pageIndex * limit : 0;
            if (this.config.type == "software") this.data$ = this.restAPIConnectorService.getAllSoftware(limit, offset); //TODO add limit and offset once back-end supports it
            else if (this.config.type == "group") this.data$ = this.restAPIConnectorService.getAllGroups(limit, offset); //TODO add limit and offset once back-end supports it
            else if (this.config.type == "matrix") this.data$ = this.restAPIConnectorService.getAllMatrices(limit, offset); //TODO add limit and offset once back-end supports it
            else if (this.config.type == "mitigation") this.data$ = this.restAPIConnectorService.getAllMitigations(limit, offset); //TODO add limit and offset once back-end supports it
            else if (this.config.type == "tactic") this.data$ = this.restAPIConnectorService.getAllTactics(limit, offset); //TODO add limit and offset once back-end supports it
            else if (this.config.type == "technique") this.data$ = this.restAPIConnectorService.getAllTechniques(limit, offset);
            else if (this.config.type == "collection") this.data$ = this.restAPIConnectorService.getAllCollections();
            else if (this.config.type == "relationship") this.data$ = this.restAPIConnectorService.getRelatedTo(this.config.sourceRef, this.config.targetRef, this.config.sourceType, this.config.targetType, this.config.relationshipType);
            let subscription = this.data$.subscribe({
                next: (data) => { this.totalObjectCount = data.pagination.total; },
                complete: () => { subscription.unsubscribe() }
            })
        }
    }
}

//allowed types for StixListConfig
type type_attacktype = "collection" | "group" | "matrix" | "mitigation" | "software" | "tactic" | "technique" | "relationship";
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
    type?: type_attacktype;
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
     */
    clickBehavior?: "expand" | "dialog"
}

export interface FilterValue {
    value: string;
    label: string;
}
export interface FilterGroup {
    disabled?: boolean; //is the entire group disabled
    name: string;
    values: FilterValue[];
}