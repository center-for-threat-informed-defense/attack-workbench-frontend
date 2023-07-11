import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
    selector: 'app-string-property',
    templateUrl: './string-property.component.html',
    styleUrls: ['./string-property.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StringPropertyComponent implements OnInit {
    @Input() public config: StringPropertyConfig;

    public allowedValues: string[];
    public dataLoaded: boolean = false;

    // map for fields with allowed values
    public fieldToStix = {
        "sector": "x_mitre_sector"
    }

    constructor(private restAPIService: RestApiConnectorService) {
        // intentionally left blank
    }

    ngOnInit(): void {
        if (this.config.field in this.fieldToStix && !this.dataLoaded) {
            let subscription = this.restAPIService.getAllAllowedValues().subscribe({
                next: (data) => {
                    let stixObject = this.config.object as StixObject;
                    let allAllowedValues = data.find(obj => obj.objectType == stixObject.attackType)
                    let property = allAllowedValues.properties.find(p => {return p.propertyName == this.fieldToStix[this.config.field]});

                    let values: Set<string> = new Set();
                    if ("domains" in this.config.object) {
                        let obj = this.config.object as any;
                        property.domains.forEach(domain => {
                            if (obj.domains.includes(domain.domainName)) {
                                domain.allowedValues.forEach(values.add, values);
                            }
                        })
                    } else { // domains not specified on object
                        property.domains.forEach(domain => {
                            domain.allowedValues.forEach(values.add, values);
                        })
                    }
                    this.allowedValues = Array.from(values);
                    this.dataLoaded = true;
                },
                complete: () => { subscription.unsubscribe(); }
            });
        }
    }
}

export interface StringPropertyConfig {
    /* What is the current mode? Default: 'view
     *    view: viewing the property
     *    edit: editing the property
     *    diff: displaying the diff between two STIX objects. If this mode is selected, two StixObjects must be specified in the objects field
     */
    mode?: "view" | "edit";
    /* The object to show the field of
     * Note: if mode is diff, pass an array of two objects to diff
     */
    object: StixObject | [StixObject, StixObject];
    /* the field of the object(s) */
    field: string;
    /* if specified, label with this string instead of field */
    label?: string;
    /* If true, the field will be required. Default false if omitted. */
    required?: boolean;
    /* Edit mode. Default: 'any' */
    editType?: "select" | "any";
}