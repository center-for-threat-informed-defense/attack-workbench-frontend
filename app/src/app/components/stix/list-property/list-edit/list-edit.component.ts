import { Component, Input, OnInit } from '@angular/core';
import { ListPropertyConfig } from '../list-property.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { Tactic } from 'src/app/classes/stix/tactic';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-list-edit',
  templateUrl: './list-edit.component.html',
  styleUrls: ['./list-edit.component.scss']
})
export class ListEditComponent implements OnInit {
    @Input() public config: ListPropertyConfig;

    // allowed values (select)
    public data$: Observable<any>;
    public allowedValues: string[] = [];
    public selectControl: FormControl;


    public stixSelect: SelectionModel<string>;
    public selectedTactics: Tactic[];

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];   

    public fieldToStix = {
        "platforms": "x_mitre_platform",
        "tactic_type": "x_mitre_tactic_types",
        "impact_type": "x_mitre_impact_type",
        "effective_permissions": "x_mitre_effective_permissions"
    }
    public domains = [
        "enterprise-attack",
        "mobile-attack",
        "ics-attack"
    ]
    public permissions = [
        "Administrator",
        "root",
        "SYSTEM",
        "User",
        "Remote Desktop Users"
    ]

    constructor(public dialog: MatDialog, private restAPIConnectorService: RestApiConnectorService) { }

    ngOnInit(): void {
        if (this.config.field == 'platforms' || this.config.field == 'tactic_type' || this.config.field == 'effective_permissions' || this.config.field == 'impact_type') {
            this.data$ = this.restAPIConnectorService.getAllAllowedValues();
            let subscription = this.data$.subscribe({
                next: (data) => { this.allowedValues = this.getAllowedValues(data) },
                complete: () => { subscription.unsubscribe(); }
            });
            
        }
        else if (this.config.field == 'domains') this.allowedValues = this.domains;
        else if (this.config.field == 'permissions_required') this.allowedValues = this.permissions;
        else if (this.config.field == 'defense_bypassed') { } //any
        else if (this.config.field == 'system_requirements') { } //any
        else if (this.config.field == 'contributors') { } //any
        else if (this.config.field == 'tactics') { } //TODO: stixList -> addDialog

        this.selectControl = new FormControl(this.config.object[this.config.field]);


        // else if (this.stixList && this.config.object.attackType == 'tactic') {
        //     // map this object tactic shortname to its stixID
        //     let stixIDs = [];
        //     let tactics: Tactic[];
        //     let something = this.restAPIConnectorService.getAllTactics();
        //     let subscription = something.subscribe({
        //         next: (data) => { 
        //             stixIDs = this.tacticShortnameToStixID(data.data as Tactic[]);
        //             this.stixSelect = new SelectionModel<string>(true, stixIDs);
        //         },
        //         complete: () => { subscription.unsubscribe() }
        //     });
        //     // this.stixSelect = new SelectionModel<string>(true, this.config.object[this.config.field]);
        // }
    }

    private tacticShortnameToStixID(tactics): String[] {
        let shortnames = this.config.object[this.config.field];

        this.selectedTactics = tactics.filter(tactic => {
            return shortnames.includes(tactic.shortname)
        });
        return this.selectedTactics.map(tactics => tactics.stixID)
        // return tactics.filter(tactic => { 
        //     return shortnames.includes(tactic.shortname);
        // })
        // .map(tactic => tactic.stixID);
    }
    
    private tacticStixIDToShortname(tacticIDs) {
        console.log("data", this.data$)
    }

    /** Get allowed values for this field */
    private getAllowedValues(data: any): string[] {
        let stixObject = this.config.object as StixObject;
        let results = data.find(obj => { return obj.objectType == stixObject.attackType; })
        let property = results.properties.find(p => {return p.propertyName == this.fieldToStix[this.config.field]});

        let values: string[] = [];
        if ("domains" in this.config.object) {
            let object = this.config.object as any;
            property.domains.forEach(domain => {
                if (object.domains.includes(domain.domainName)) {
                    values = values.concat(domain.allowedValues);
                }
            })
        } 
        else { // domains not specified on object
            property.domains.forEach(domain => {
                values = values.concat(domain.allowedValues);
            });
        }
        return values;
    }

    /** Add value to object property list */
    public add(event: MatChipInputEvent): void {
        if (event.value && event.value.trim()) {
            this.config.object[this.config.field].push(event.value.trim());
        }
        if (event.input) {
            event.input.value = ''; // reset input value
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

    /** Open stix list selection window */
    public open() {
        // const dialogRef = this.dialog.open(template, { });

        // let subscription = dialogRef.afterClosed().subscribe({
        //     next: () => {
        //         let stixIDs = this.stixSelect.selected;
        //         let shortnames = this.tacticStixIDToShortname(stixIDs);
        //     },
        //     complete: () => { if (subscription) subscription.unsubscribe(); } //prevent memory leaks
        // });
    }
}