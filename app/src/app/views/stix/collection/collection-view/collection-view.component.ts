import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Collection, CollectionImportCategories } from 'src/app/classes/stix/collection';
import { Group } from 'src/app/classes/stix/group';
import { Matrix } from 'src/app/classes/stix/matrix';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { Relationship } from 'src/app/classes/stix/relationship';
import { Software } from 'src/app/classes/stix/software';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { StixViewPage } from '../../stix-view-page';

@Component({
  selector: 'app-collection-view',
  templateUrl: './collection-view.component.html',
  styleUrls: ['./collection-view.component.scss']
})
export class CollectionViewComponent extends StixViewPage implements OnInit {
    
    public get collection(): Collection { return this.config.object as Collection; }
    public object_import_categories = {
        technique:    new CollectionImportCategories<Technique>(),
        tactic:       new CollectionImportCategories<Tactic>(),
        software:     new CollectionImportCategories<Software>(),
        relationship: new CollectionImportCategories<Relationship>(),
        mitigation:   new CollectionImportCategories<Mitigation>(),
        matrix:       new CollectionImportCategories<Matrix>(),
        group:        new CollectionImportCategories<Group>()
    }

    constructor(private route: ActivatedRoute) { super() }

    ngOnInit() {
        // parse collection into object_import_categories
    }

}
