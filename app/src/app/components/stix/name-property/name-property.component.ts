import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Relationship } from 'src/app/classes/stix/relationship';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { Technique } from 'src/app/classes/stix/technique';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-name-property',
  templateUrl: './name-property.component.html',
  styleUrls: ['./name-property.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NamePropertyComponent implements OnInit {
    @Input() public config: NamePropertyConfig;
    public target_obj?: StixObject;
    public loaded: boolean = false;

    constructor(private restAPIService: RestApiConnectorService) { }

    ngOnInit(): void {
        let object = Array.isArray(this.config.object)? this.config.object[0] : this.config.object;
        if (object.revoked) {
            // retrieve revoking object
            let data$ = this.restAPIService.getRelatedTo({sourceRef: object.stixID, relationshipType: 'revoked-by'});
            let relSubscription = data$.subscribe({
                next: (data) => {
                    let relationship = data.data[0] as Relationship;
                    this.target_obj = relationship.target_object as Technique;
                    this.loaded = true;
                },
                complete: () => { relSubscription.unsubscribe() }
            });
        }
    }

}

export interface NamePropertyConfig {
    /* What is the current mode? Default: 'view
     *    view: viewing the list property
     *    edit: editing the list property
     *    diff: displaying the diff between two STIX objects. If this mode is selected, two StixObjects must be specified in the objects field
     */
    mode?: "view" | "edit" | "diff";
    /* The object to show the field of
     * Note: if mode is diff, pass an array of two objects to diff
     */
    object: StixObject | [StixObject, StixObject];
    /* the field of the object(s) to visualize as a name
     * If unspecified, uses 'name' field as defined on StixObject
     */
    field?: string;
}