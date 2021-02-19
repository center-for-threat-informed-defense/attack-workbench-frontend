import { Component, Input, OnInit } from '@angular/core';
import { ListPropertyConfig } from '../list-property.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-edit',
  templateUrl: './list-edit.component.html',
  styleUrls: ['./list-edit.component.scss']
})
export class ListEditComponent implements OnInit {
    @Input() public config: ListPropertyConfig;

    public selectList: string[] = []
    public selectControl: FormControl;
    public data$: Observable<any>;

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    public fieldNameToField = {
        "platforms": "x_mitre_platform",
        "tactic_type": "x_mitre_tactic_types"
    }
    public validDomains = [
        "enterprise-attack",
        "mobile-attack",
        "ics-attack"
    ]

    constructor(public dialog: MatDialog, private restAPIConnectorService: RestApiConnectorService) { }

    ngOnInit(): void {
        if (this.config.field == 'platforms' || this.config.field == 'tactic_type') {
            // fetch allowed values from backend
            this.data$ = this.restAPIConnectorService.getAllowedValues(this.config.objectType);
            let subscription = this.data$.subscribe({
                next: (data) => { this.selectList = this.getAllowedValues(data); },
                complete: () => { subscription.unsubscribe() }
            });
            // initialize form control selection
            this.selectControl = new FormControl(this.config.object[this.config.field]); 
        }
        else if (this.config.field == 'domains') {
            this.selectList = this.validDomains;
            // initialize form control selection
            this.selectControl = new FormControl(this.config.object[this.config.field]);
        }
    }

    /** Get allowed values for this field */
    private getAllowedValues(data: any): string[] {
        let property = data.properties.find(p => {return p.propertyName == this.fieldNameToField[this.config.field]});

        let allowedValues: string[] = [];
        if ("domains" in this.config.object) {
            let object = this.config.object as any;
            property.domains.forEach(domain => {
                if (object.domains.includes(domain.domainName)) {
                    allowedValues = allowedValues.concat(domain.allowedValues);
                }
            })
        } 
        else { // domains not specified on object
            property.domains.forEach(domain => {
                allowedValues = allowedValues.concat(domain.allowedValues);
            });
        }
        return allowedValues;
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

    public openModal(template) {
        this.dialog.open(template, {
            width: '250px',
       });
    }
}