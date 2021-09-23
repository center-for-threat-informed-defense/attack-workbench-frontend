import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CollectionDiffCategories } from 'src/app/classes/stix/collection';
import { DataComponent } from 'src/app/classes/stix/data-component';
import { DataSource } from 'src/app/classes/stix/data-source';
import { Group } from 'src/app/classes/stix/group';
import { Matrix } from 'src/app/classes/stix/matrix';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { Relationship } from 'src/app/classes/stix/relationship';
import { Software } from 'src/app/classes/stix/software';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';

@Component({
  selector: 'app-collection-import-summary',
  templateUrl: './collection-import-summary.component.html',
  styleUrls: ['./collection-import-summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionImportSummaryComponent implements OnInit {
    @Input() config: CollectionImportSummaryConfig;

    constructor() { }

    ngOnInit(): void {
    }

    public format(attackType: string): string {
        return attackType.replace(/_/g, ' ');
    }
}

export interface CollectionImportSummaryConfig {
    object_import_categories: {
        technique: CollectionDiffCategories<Technique>,
        tactic: CollectionDiffCategories<Tactic>,
        software: CollectionDiffCategories<Software>,
        relationship: CollectionDiffCategories<Relationship>,
        mitigation: CollectionDiffCategories<Mitigation>,
        matrix: CollectionDiffCategories<Matrix>,
        group: CollectionDiffCategories<Group>,
        data_source: CollectionDiffCategories<DataSource>,
        data_component: CollectionDiffCategories<DataComponent>
    };
    select?: SelectionModel<string>;
}
