import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Collection, CollectionImportCategories, VersionReference } from 'src/app/classes/stix/collection';
import { Group } from 'src/app/classes/stix/group';
import { Matrix } from 'src/app/classes/stix/matrix';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { Relationship } from 'src/app/classes/stix/relationship';
import { Software } from 'src/app/classes/stix/software';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { StixViewPage } from '../../stix-view-page';

type changeCategory = "additions" | "changes" | "minor_changes" | "revocations" | "deprecations";

@Component({
  selector: 'app-collection-view',
  templateUrl: './collection-view.component.html',
  styleUrls: ['./collection-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionViewComponent extends StixViewPage implements OnInit {
    public get collection(): Collection { return this.config.object as Collection; }
    public editing: boolean = false;
    public page: string = "home";

    public potentialChanges = {
        technique:    new CollectionImportCategories<Technique>(),
        tactic:       new CollectionImportCategories<Tactic>(),
        software:     new CollectionImportCategories<Software>(),
        relationship: new CollectionImportCategories<Relationship>(),
        mitigation:   new CollectionImportCategories<Mitigation>(),
        matrix:       new CollectionImportCategories<Matrix>(),
        group:        new CollectionImportCategories<Group>()
    }
    public collectionChanges = {
        technique:    new CollectionImportCategories<Technique>(),
        tactic:       new CollectionImportCategories<Tactic>(),
        software:     new CollectionImportCategories<Software>(),
        relationship: new CollectionImportCategories<Relationship>(),
        mitigation:   new CollectionImportCategories<Mitigation>(),
        matrix:       new CollectionImportCategories<Matrix>(),
        group:        new CollectionImportCategories<Group>()
    }

    public collection_import_categories = [];


    constructor(private route: ActivatedRoute) { super();  }

    public stageChanges(refs: VersionReference[], fromCategory: changeCategory, toCategory: changeCategory): void {

    }

    public unstageChanges(refs: VersionReference[], fromCategory: changeCategory, toCategory: changeCategory): void {

    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.editing = params["editing"];
        });


        // initialize collectionChanges against previously published version
    }

}
