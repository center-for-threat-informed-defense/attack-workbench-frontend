import { AfterContentChecked, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ListPropertyConfig } from '../list-property.component';
import { ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Paginated, RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Tactic } from 'src/app/classes/stix/tactic';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { AddDialogComponent } from 'src/app/components/add-dialog/add-dialog.component';
import { Subscription } from 'rxjs';
import { Technique } from 'src/app/classes/stix/technique';

@Component({
  selector: 'app-list-edit',
  templateUrl: './list-edit.component.html',
  styleUrls: ['./list-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListEditComponent implements OnInit, AfterContentChecked {
    @Input() public config: ListPropertyConfig;

    // allowed values (editType: 'select')
    public allAllowedValues: any;
    public selectControl: FormControl;
    public dataLoaded: boolean = false;

    // selection model (editType: 'stixList')
	public stixControl: FormControl;
    public select: SelectionModel<string>;
    public type: string;
    public allObjects: StixObject[] = [];

    // any value (editType: 'any')
    public inputControl: FormControl;
    readonly separatorKeysCodes: number[] = [ENTER];   

    // prevent async issues
    private sub: Subscription = new Subscription();

    // domain & tactic selection state
    private domainState: string[];
    private tacticState: Tactic[];

    public fieldToStix = {
        "platforms": "x_mitre_platforms",
        "tactic_type": "x_mitre_tactic_type",
        "impact_type": "x_mitre_impact_type",
        "effective_permissions": "x_mitre_effective_permissions",
        "permissions_required": "x_mitre_permissions_required",
        "collection_layers": "x_mitre_collection_layers",
        "data_sources": "x_mitre_data_sources",
        "sectors": "x_mitre_sectors"
    }
    public domains = [
        "enterprise-attack",
        "mobile-attack",
        "ics-attack"
    ]

    public get values() {
        if (this.config.field == "aliases") return this.config.object[this.config.field].slice(1); // filter out the first alias
        return this.config.object[this.config.field];
    }

    constructor(public dialog: MatDialog, private restAPIConnectorService: RestApiConnectorService, private ref: ChangeDetectorRef) {
        // intentionally left blank
    }

    ngOnInit(): void {
        this.selectControl = new FormControl({value: this.config.object[this.config.field], disabled: this.config.disabled ? this.config.disabled : false});
        this.inputControl = new FormControl(null, this.config.required ? [Validators.required] : undefined);
		this.stixControl = new FormControl(this.selectedValues());
        if (this.config.field == 'platforms' 
         || this.config.field == 'tactic_type' 
         || this.config.field == 'permissions_required' 
         || this.config.field == 'effective_permissions' 
         || this.config.field == 'impact_type'
         || this.config.field == 'domains'
         || this.config.field == 'collection_layers'
         || this.config.field == 'data_sources'
         || this.config.field == 'sectors') {
            if (!this.dataLoaded) {
                let data$ = this.restAPIConnectorService.getAllAllowedValues();
                this.sub = data$.subscribe({
                    next: (data) => {
                        let stixObject = this.config.object as StixObject;
                        this.allAllowedValues = data.find(obj => { return obj.objectType == stixObject.attackType; });
                        this.dataLoaded = true;
                    },
                    complete: () => { this.sub.unsubscribe(); }
                });
            }
        }
        else if (this.config.field == 'defense_bypassed' || this.config.field == 'system_requirements' || this.config.field == 'contributors') {
            //any
        }
        else if (this.config.field == 'tactics') {
            this.type = 'tactic';
            let subscription = this.restAPIConnectorService.getAllTactics().subscribe({
                next: (tactics) => { 
                    this.allObjects = tactics.data;

                    // retrieve currently selected tactics
                    let object = this.config.object as any;
                    let selectedTactics = this.shortnameToTactic(object.domains);
                    let selectedTacticIDs = selectedTactics.map(tactic => tactic.stixID);

                    // set up domain & tactic tracking
                    this.domainState = [];
                    this.tacticState = [];
                    object.domains.forEach(domain => this.domainState.push(domain));
                    selectedTactics.forEach(tactic => this.tacticState.push(tactic));

                    // set selection model with initial values
                    this.select = new SelectionModel<string>(true, selectedTacticIDs);
                    this.dataLoaded = true;
                },
                complete: () => { subscription.unsubscribe(); }
            })
        } else if (this.config.field == 'parentTechnique') {
            this.type = 'technique';
            const subscription = this.restAPIConnectorService.getAllTechniques().subscribe({
                next: (r: Paginated<Technique>) => {
                    this.allObjects = r.data.filter((t) => !t.is_subtechnique);
                    const selectableTechniqueIDs = r.data.map(t => t.stixID);
                    this.select = new SelectionModel<string>(false, selectableTechniqueIDs);
                    this.dataLoaded = true;
                },
                complete: () => {
                    subscription.unsubscribe();
                }
            });
        }
    }

    ngAfterContentChecked() {
        this.ref.detectChanges();
    }

    /** Clear attack ID field if parent technique is changed */
    public onBlur() {
        if (this.config.label === 'parent technique' && !(this.config.object as StixObject).firstInitialized) {
            (this.config.object as StixObject).attackID = '';
        }
    }

    /** Retrieves a list of selected tactics */
    private shortnameToTactic(domains: string[]): Tactic[] {
        let allObjects = this.allObjects as Tactic[];
        let tactics = this.config.object[this.config.field].map(shortname => {
            return allObjects.find(tactic => {
                return tactic.shortname == shortname && this.tacticInDomain(tactic, domains)
            });
        })
        return tactics;
    }

    /** Retrieves a list of selected tactic shortnames */
    private stixIDToShortname(tacticID: string): string[] {
        let allObjects = this.allObjects as Tactic[];
        let tactic = allObjects.find(object => object.stixID == tacticID)
        return [tactic.shortname, tactic.domains[0]];
    }

    /** Update current stix-list selection on domain change */
    public selectedValues(): string[] {
        if (!this.dataLoaded) return null;

        let isEqual = function(arr1:string[], arr2:string[]) {
            return (arr1.length == arr2.length) && arr1.every(function(element, index) {
                return element === arr2[index]; 
            });
        }

        if (this.config.field == 'tactics') {
            let object = this.config.object as Tactic;
            if (!isEqual(this.domainState, object.domains)) {
                // get selected tactics
                let selectedTactics = this.tacticState;
                if (object.domains.length < this.domainState.length) { // a domain was removed
                    // filter selected tactics with updated domain selection
                    selectedTactics = selectedTactics.filter(tactic => this.tacticInDomain(tactic));
                    let selectedTacticIDs = selectedTactics.map(tactic => tactic.stixID);
                    let tacticShortnames = selectedTacticIDs.map(id => this.stixIDToShortname(id));

                    // udpate object & selection model
                    this.config.object[this.config.field] = tacticShortnames;
                    this.select.clear();
                    selectedTacticIDs.forEach(tactic=>this.select.select(tactic));
                }

                // reset domain & tactic selection state with a copy of current state
                this.domainState = [];
                this.tacticState = [];
                object.domains.forEach(domain => this.domainState.push(domain));
                selectedTactics.forEach(tactic => this.tacticState.push(tactic));
            }
        }
        if (this.config.field == 'parentTechnique' && this.config.object[this.config.field]) {
          return [this.config.object[this.config.field]?.name]
        }
        return this.config.object[this.config.field];
    }
    
    /** Get allowed values for this field */
    public getAllowedValues(): Set<string> {
        if (this.config.field == 'domains') return new Set(this.domains);
        if (!this.dataLoaded) {
            this.selectControl.disable();
            return null;
        }

        // filter values
        let values: Set<string> = new Set();
        let property = this.allAllowedValues.properties.find(p => {return p.propertyName == this.fieldToStix[this.config.field]});
        if (!property) { // property not found
            this.selectControl.disable();
            return null;
        }

        if ("domains" in this.config.object) {
            let object = this.config.object as any;
            property.domains.forEach(domain => {
                if (object.domains.includes(domain.domainName)) {
                    domain.allowedValues.forEach(values.add, values);
                }
            })
        } 
        else { // domains not specified on object
            property.domains.forEach(domain => {
                domain.allowedValues.forEach(values.add, values);
            });
        }

        // check for existing data
        if (this.selectControl.value) {
            this.selectControl.value.forEach(values.add, values);
        }

        if (!values.size) {
            // disable field and reset selection
            this.selectControl.disable();
            this.selectControl.reset();
            this.config.object[this.config.field] = [];
        }
        else {
            this.selectControl.enable(); // re-enable field
        }
        return values;
    }

    /** Add value to object property list */
    public add(event: MatChipInputEvent): void {
        if (event.value?.trim()) {
            this.config.object[this.config.field].push(event.value.trim());
            this.inputControl.setValue(this.config.object[this.config.field]);
        }
        if (event.chipInput.inputElement.value) {
            event.chipInput.inputElement.value = ''; // reset input value
        }
    }

    /** Remove value from object property list */
    public remove(value: string): void {
        let i = this.config.object[this.config.field].indexOf(value);
        if (i >= 0) {
            this.config.object[this.config.field].splice(i, 1);
        }
    }

    /** Remove selection from via chip cancel button */
    public removeSelection(value: string): void {
        let values = this.selectControl.value as string[];
        let i = values.indexOf(value);
        if (i >= 0) {
            values.splice(i, 1);
        }
        this.selectControl.setValue([]); // reset selection
        this.selectControl.setValue(values); 
        this.remove(value); // remove value from object property
    }

    /** Add or remove selection from object property list via select-list */
    public change(event: MatOptionSelectionChange): void {
        if (event.isUserInput) {
            if (event.source.selected) this.config.object[this.config.field].push(event.source.value);
            else this.remove(event.source.value);
        }
    }

    /** Check if the given tactic is in the same domain as this object */
    private tacticInDomain(tactic: Tactic, domains?: string[]) {
        let object = this.config.object as Tactic;
        let checkDomains = domains ? domains : object.domains;
        for (let domain of tactic.domains) {
            if (checkDomains.includes(domain)) return true;
        }
    }

    /** Open stix list selection window */
    public openStixList() {
        if (this.config.disabled) return; // cannot open stix list if field is disabled
        if (this.config.field == 'parentTechnique') this.openParentTechniqueList();
        if (this.config.field == 'tactics') this.openTacticList();
    }

    /** Open tactic list */
    public openTacticList(): void {
        // get list of tactics in current domain
        let tactics = this.allObjects as Tactic[];
        let selectableObjects = tactics.filter(tactic => this.tacticInDomain(tactic));

        // open dialog window for user selection
        let dialogRef = this.openDialogComponent(selectableObjects);

        // copy user selection
        let selectCopy = new SelectionModel(true, this.select.selected);
        let subscription = dialogRef.afterClosed().subscribe({
            next: (result) => {
                if (result) {
                    let tacticShortnames = this.select.selected.map(id => this.stixIDToShortname(id));
                    this.config.object[this.config.field] = tacticShortnames;

                    // reset tactic selection state
                    this.tacticState = [];
                    let tactic_selection = this.select.selected.map(tacticID => tactics.find(tactic => tactic.stixID == tacticID));
                    tactic_selection.forEach(tactic => this.tacticState.push(tactic));
                } else { // user cancel
                    this.select = selectCopy; // reset selection
                }
            },
            complete: () => { subscription.unsubscribe(); }
        });
    }

    /** Open parent technique list */
    public openParentTechniqueList(): void {
        // check if parent techniques have been loaded, if not, do nothing
        if (this.config.label === 'parent technique' && !this.dataLoaded) return;
        // otherwise, open the dialog window for user selection
        let dialogRef = this.openDialogComponent(this.allObjects);

        // copy the user selection
        let selectCopy = new SelectionModel(false, this.select.selected);
        let subscription = dialogRef.afterClosed().subscribe({
            next: (result) => {
                if (result) { // update parent technique
                    let allObjects = this.allObjects as Technique[];
                    let selection = this.select.selected.length > 0 ? allObjects.find(t => t.stixID === this.select.selected[0]) : null;
                    this.config.object[this.config.field] = selection;
                } else { // user cancelled
                    this.select = selectCopy; // reset selection
                }
            },
            complete: () => { subscription.unsubscribe(); }
        });
    }

    /** Open the AddDialogComponent with the given list of selectable objects */
    public openDialogComponent(selectableObjects) {
        return this.dialog.open(AddDialogComponent, {
            maxWidth: "70em",
            maxHeight: "70em",
            data: {
                selectableObjects: selectableObjects,
                select: this.select,
                type: this.type,
                buttonLabel: "OK"
            }
        });
    }
}