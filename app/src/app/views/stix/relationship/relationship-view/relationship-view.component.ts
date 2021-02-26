import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observer } from 'rxjs';
import { Relationship } from 'src/app/classes/stix/relationship';
import { stixTypeToAttackType } from 'src/app/classes/stix/stix-object';
import { StixListComponent } from 'src/app/components/stix/stix-list/stix-list.component';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixViewPage } from '../../stix-view-page';

@Component({
  selector: 'app-relationship-view',
  templateUrl: './relationship-view.component.html',
  styleUrls: ['./relationship-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RelationshipViewComponent extends StixViewPage implements OnInit, OnDestroy {

    public get relationship() { return this.config.object as Relationship; }
    @ViewChild('source_select') private source_select: StixListComponent;
    @ViewChild('target_select') private target_select: StixListComponent;
    public source_type: string;
    public target_type: string;
    public selectionModel_source: SelectionModel<string>;
    public selectionModel_source_listener: Observer<any>;
    public selectionModel_target: SelectionModel<string>;
    public selectionModel_target_listener: Observer<any>;
    public refresh: boolean = true;
    /** refresh the list of source objects if the type changes */
    public refresh_lists() {
        this.refresh = false;
        setTimeout(() => {
            this.refresh = true;
        })
    }

    constructor(private restApiService: RestApiConnectorService) { 
        super()
    }

    ngOnInit(): void {
        if (this.relationship.source_object) this.source_type = stixTypeToAttackType[this.relationship.source_object.stix.type]
        if (this.relationship.target_object) this.target_type = stixTypeToAttackType[this.relationship.target_object.stix.type]
        this.selectionModel_source = new SelectionModel(false, [this.relationship.source_ref], true);
        this.selectionModel_target = new SelectionModel(false, [this.relationship.target_ref], true);
        this.selectionModel_source.changed.subscribe(() => { 
            let subscription = this.relationship.set_source_ref(this.selectionModel_source.selected[0], this.restApiService).subscribe({
                complete: () => subscription.unsubscribe()
            }) 
        });
        this.selectionModel_target.changed.subscribe(() => { 
            let subscription = this.relationship.set_target_ref(this.selectionModel_target.selected[0], this.restApiService).subscribe({
                complete: () => subscription.unsubscribe()
            }) 
        });
    }

    ngOnDestroy(): void {
        this.selectionModel_source.changed.unsubscribe();
        this.selectionModel_source.changed.unsubscribe();
    }

}
