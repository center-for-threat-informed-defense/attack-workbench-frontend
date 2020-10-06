import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { CollectionService } from 'src/app/services/stix/collection/collection.service';
import { MatTreeNestedDataSource } from '@angular/material';
import { NestedTreeControl } from '@angular/cdk/tree';

@Component({
  selector: 'app-stix-list',
  templateUrl: './stix-list.component.html',
  styleUrls: ['./stix-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StixListComponent implements OnInit {

    @Input() stixObjects: StixObject[]; //TODO get rid of this in favor of stix list cards loading using filters
    @Input() showOnly: StixListConfig = {};
    //view mode
    private mode: string = "cards";
    //options provided to the user for grouping and filtering
    private filterOptions: FilterGroup[];
    //current grouping and filtering selections
    private filter: string[] = [];
    private groupBy: string[] = [];
    // search query
    private query: string = "";
    
    
    //dataSource for the tree
    private dataSource = new MatTreeNestedDataSource<StixListNode>();
    //control for node visibility for the tree
    private treeControl = new NestedTreeControl<StixListNode>(node => node.children);
    //trackBy function for the tree
    private treeNodeTrackBy(index, item: StixListNode) {
        return item.name;
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

    constructor(private collectionService: CollectionService) {}

    private generateSections() {
        // parse filters into StixListConfig objects
        let parsedFilters: StixListConfig[] = [];
        for (let filter of this.filter) {
            let filterType = filter.split(".")[0];
            let filterConfig: StixListConfig = {}
            filterConfig[filterType] = filter;
            parsedFilters.push(filterConfig);
        }

        this.dataSource.data = null; //for some reason if you don't first set it to null Angular doesn't see a change
        if (this.groupBy.includes("type")) this.dataSource.data = this.generateTypeSections(parsedFilters);
        else this.dataSource.data = this.generateSubsection("type", parsedFilters);
    }
    // does the given node have children?
    private hasChildren(index, node) { return !!node.children && node.children.length > 0}

    /**
     * generate the next subsection of the current section
     * @param {string} currentSection: name of the current section
     * @param {StixListConfig[]} parentFilters: filters inherited from parent sections
     * @returns {StixListNode[]} node tree for this subsection and all child subsections
     */
    private generateSubsection(currentSection: string, parentFilters: StixListConfig[]): StixListNode[] {
        if (currentSection == "type") {
            if (!this.groupBy.includes("domain")) {
                return this.generateSubsection("domain", parentFilters);
            } else {
                return this.generateDomainSections(parentFilters);
            }
        } else if (currentSection == "domain") {
            if (!this.groupBy.includes("collection")) {
                return this.generateSubsection("collection", parentFilters);
            } else {
                return this.generateCollectionSections(parentFilters);
            }
        } else if (currentSection == "collection") {
            if (this.groupBy.includes("status")) {
                return this.generateStatusSections(parentFilters);
            } else return []; //else don't skip because there's nothing else
        }
    }
    /**
     * generate sections for each type, and child sections
     * @param {StixListConfig[]} parentFilters filters inherited from parent sections
     * @returns {StixListNode[]} node tree for this subsection and all child subsections
     */
    private generateTypeSections(parentFilters: StixListConfig[]): StixListNode[] {
        let configs: StixListNode[] = []
        for (let thetype of this.types) {
            // check if this type is filtered
            let filtered = false;
            for (let filter of parentFilters) {
                if (filter.type && filter.type == thetype.value) {
                    filtered = false;
                    break;
                } else if (filter.type) { filtered = true; }
            }

            if (filtered) continue;

            // add the type
            //remove other filters for type because we only want this type for descendants
            let filters = parentFilters.filter((filter: StixListConfig) => !filter.type).concat([{"type": thetype.value as type_attacktype}]);
            configs.push({
                name: thetype.label,
                filters: filters,
                children: this.generateSubsection("type", filters)
            })
        }
        return configs;
    }
    /**
     * generate sections for each domain, and child sections
     * @param {StixListConfig[]} parentFilters filters inherited from parent sections
     * @returns {StixListNode[]} node tree for this subsection and all child subsections
     */
    private generateDomainSections(parentFilters: StixListConfig[]): StixListNode[] {
        let configs: StixListNode[] = []
        for (let domain of this.domains) {
            // check if this domain is filtered
            let filtered = false;
            for (let filter of parentFilters) {
                if (filter.domain && filter.domain == domain.value) {
                    filtered = false;
                    break;
                } else if (filter.domain) { filtered = true; }
            }

            if (filtered) continue;

            //add the domain
            //remove other filters for domain because we only want this domain for descendants
            let filters = parentFilters.filter((filter: StixListConfig) => !filter.domain).concat([{"domain": domain.value as type_domain}]);
            configs.push({
                name: domain.label,
                filters: filters,
                children: this.generateSubsection("domain", filters)
            })
        }
        return configs;
    }

    /**
     * generate sections for each collection, and child sections
     * @param {StixListConfig[]} parentFilters filters inherited from parent sections
     * @returns {StixListNode[]} node tree for this subsection and all child subsections
     */
    private generateCollectionSections(parentFilters: StixListConfig[]): StixListNode[] {
        let configs: StixListNode[] = []
        for (let collection of this.collections) {
            // check if this collection is filtered
            let filtered = false;
            for (let filter of parentFilters) {
                if (filter.collection && filter.collection == collection.value) {
                    filtered = false;
                    break;
                } else if (filter.collection) { filtered = true; }
            }

            if (filtered) continue;

            //add the collection
            //remove other filters for collection because we only want this collection for descendants
            let filters = parentFilters.filter((filter: StixListConfig) => !filter.collection).concat([{"collection": collection.value}]);
            configs.push({
                name: collection.label,
                filters: filters,
                children: this.generateSubsection("collection", filters)
            })
        }
        return configs;
    }

    /**
     * generate sections for each status, and child sections
     * @param {StixListConfig[]} parentFilters filters inherited from parent sections
     * @returns {StixListNode[]} node tree for this subsection and all child subsections
     */
    private generateStatusSections(parentFilters: StixListConfig[]): StixListNode[] {
        let configs: StixListNode[] = []
        for (let status of this.statuses) {
            // check if this status is filtered
            let filtered = false;
            for (let filter of parentFilters) {
                if (filter.status && filter.status == status.value) {
                    filtered = false;
                    break;
                } else if (filter.status) { filtered = true; }
            }

            if (filtered) continue;

            //add the status
            //remove other filters for status because we only want this status for descendants
            configs.push({
                name: status.label,
                filters: parentFilters.filter((filter: StixListConfig) => !filter.status).concat([{"status": status.value as type_status}]),
                children: []
            })
        }
        return configs;
    }

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
        this.generateSections();
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