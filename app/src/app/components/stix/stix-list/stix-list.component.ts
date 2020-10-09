import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { CollectionService } from 'src/app/services/stix/collection/collection.service';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-stix-list',
  templateUrl: './stix-list.component.html',
  styleUrls: ['./stix-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('detailExpand', [
        state('collapsed', style({height: '0px', minHeight: '0'})),
        state('expanded', style({height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
  ]
})
export class StixListComponent implements OnInit {

    @Input() public relatedTo: String = null;
    @Input() public type: String = null

    @Input() public stixObjects: StixObject[]; //TODO get rid of this in favor of stix list cards loading using filters
    @Input() public showOnly: StixListConfig = {};
    //view mode
    public mode: string = "cards";
    //options provided to the user for grouping and filtering
    public filterOptions: FilterGroup[];
    //current grouping and filtering selections
    public filter: string[] = [];
    public groupBy: string[] = [];
    // search query
    public query: string = "";

    // TABLE STUFF
    public tableColumns: string[] = [
        "name", 
        "attackType",
        "version"
    ]
    public expandedElement: StixObject | null;
    // @ViewChild(MatSort) public sort: MatSort;
    // @ViewChild(MatPaginator) public paginator: MatPaginator;

    
    
    





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

    constructor(private collectionService: CollectionService) {}

    ngOnInit() {
        this.collections = this.collectionService.getAll().map((collection) => {return {"value": "collection." + collection.stixID, "label": collection.name}})
        this.filterOptions = []
        if ("type" in this.showOnly) { this.filter.push("type." + this.showOnly.type); }
        else {
            this.filterOptions.push({
                "name": "type", //TODO make more extensible to additional types
                "disabled": "type" in this.showOnly,
                "values": this.types
            })
            this.groupBy = ["type"];
        }
        if ("domain" in this.showOnly) { this.filter.push("domain." + this.showOnly.domain); }
        else {
            this.filterOptions.push({
                "name": "domain", //TODO dynamic domain values
                "disabled": "domain" in this.showOnly,
                "values": this.domains
            })
            if (this.groupBy.length == 0) this.groupBy = ["domain"];
        }
        if ("collection" in this.showOnly) { this.filter.push("collection." + this.showOnly.collection); }
        else {
            this.filterOptions.push({
                "name": "collection", //TODO dynamic collection list
                "disabled": "collection" in this.showOnly,
                "values": this.collections
            })
            if (this.groupBy.length == 0) this.groupBy = ["collection"];
        }
        if ("status" in this.showOnly) { this.filter.push("status." + this.showOnly.status); }
        else {
            this.filterOptions.push({
                "name": "status",
                "disabled": "status" in this.showOnly,
                "values": this.statuses
            })
            if (this.groupBy.length == 0) this.groupBy = ["status"];
        }
    }
}

//allowed types for StixListConfig
type type_attacktype = "collection" | "group" | "matrix" | "mitigation" | "software" | "tactic" | "technique";
type type_domain = "enterprise-attack" | "mobile-attack";
type type_status = "status.wip" | "status.awaiting-review" | "status.reviewed";
export interface StixListConfig {
    /** force the list to show only this type */
    type?: type_attacktype;
    /** force the list to show only this domain */
    domain?: type_domain;
    /** force the list to show only this collection; arg is stix ID */
    collection?: string;
    /** force the list to show only objects with this status */
    status?: type_status;
}

export interface StixListNode {
    name: string;
    filters: StixListConfig[];
    children?: StixListNode[];
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