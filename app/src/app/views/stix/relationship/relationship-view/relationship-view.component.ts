import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Relationship } from 'src/app/classes/stix/relationship';
import { StixObject, stixTypeToAttackType } from 'src/app/classes/stix/stix-object';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixViewPage } from '../../stix-view-page';
import * as moment from 'moment';

@Component({
  selector: 'app-relationship-view',
  templateUrl: './relationship-view.component.html',
  styleUrls: ['./relationship-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RelationshipViewComponent extends StixViewPage implements OnInit {

    public get relationship() { return this.config.object as Relationship; }
    public source_type: string;
    public target_type: string;
    public refresh: boolean = true;
    public loaded: boolean = false;
    /** refresh the list of source objects if the type changes 
     *  This is bad code and should be done a better way.
     */
    public refresh_lists() {
        this.refresh = false;
        setTimeout(() => {
            this.refresh = true;
        })
    }

    constructor(private restApiService: RestApiConnectorService, authenticationService: AuthenticationService) { 
        super(authenticationService)
    }

    ngOnInit(): void {
        // initialize source/target types if there is a source/target object, or if there is only one possible value
        if (this.relationship.source_object) this.source_type = stixTypeToAttackType[this.relationship.source_object.stix.type]
        else if (this.relationship.valid_source_types.length == 1) this.source_type = this.relationship.valid_source_types[0];
        if (this.relationship.target_object) this.target_type = stixTypeToAttackType[this.relationship.target_object.stix.type]
        else if (this.relationship.valid_target_types.length == 1) this.target_type = this.relationship.valid_target_types[0];

        // fetch parent of source and/or target objects
        let parent_calls = [];
        if (this.relationship.source_object) {
            if (this.relationship.source_object.stix.x_mitre_is_subtechnique || this.source_type == 'data-component') {
                parent_calls.push(this.relationship.update_source_parent(this.restApiService));
            }
        }
        if (this.relationship.target_object) {
            if (this.relationship.target_object.stix.x_mitre_is_subtechnique || this.target_type == 'data-component') {
                parent_calls.push(this.relationship.update_target_parent(this.restApiService));
            }
        }
        if (parent_calls.length) {
            var pSubscription = forkJoin(parent_calls).subscribe({
                complete: () => {
                    this.loaded = true;
                    if (pSubscription) pSubscription.unsubscribe(); 
                }
            });
        } else this.loaded = true;
    }

    public setSourceObject(object: StixObject) {
        var subscription = this.relationship.set_source_object(object, this.restApiService).subscribe({
            complete: () => { if (subscription) subscription.unsubscribe() } //subscription doesn't exist for some reason in this case
        }) 
    }

    public setTargetObject(object: StixObject) {
        var subscription = this.relationship.set_target_object(object, this.restApiService).subscribe({
            complete: () => { if (subscription) subscription.unsubscribe() } //subscription doesn't exist for some reason in this case
        }) 
    }

    /**
     * Get the object version and last modified date information to display in the relationship view
     * @param {any} obj the object to retrieve details for
     * @returns formatted string with object's version (if defined) and last modified date (if defined)
     */
    public getObjectDetails(obj: any): string {
        if (!obj || !obj["stix"]) return '';

        let version = obj["stix"].x_mitre_version;
        let modified = obj["stix"].modified ? moment(obj["stix"].modified).format('D MMM YYYY, h:mm A') : undefined;
        
        if (version && modified) return `(v${version}, last modified ${modified})`;
        else if (version && !modified) return `(v${version})`;
        else if (!version && modified) return `(last modified ${modified})`;
        else return '';
    }
}
