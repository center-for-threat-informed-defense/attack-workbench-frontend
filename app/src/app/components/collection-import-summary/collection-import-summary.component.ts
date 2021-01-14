import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CollectionImportCategories } from 'src/app/classes/stix/collection';
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

}

export interface CollectionImportSummaryConfig {
    object_import_categories: {
        technique: CollectionImportCategories<Technique>,
        tactic: CollectionImportCategories<Tactic>,
        software: CollectionImportCategories<Software>,
        relationship: CollectionImportCategories<Relationship>,
        mitigation: CollectionImportCategories<Mitigation>,
        matrix: CollectionImportCategories<Matrix>,
        group: CollectionImportCategories<Group>
    }
}
