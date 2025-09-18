import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {
  Collection,
  CollectionDiffCategories,
} from 'src/app/classes/stix/collection';
import {
  Analytic,
  Asset,
  Campaign,
  DataComponent,
  DataSource,
  DetectionStrategy,
  Group,
  Matrix,
  Mitigation,
  Relationship,
  Software,
  Tactic,
  Technique,
} from 'src/app/classes/stix';
import { EditorService } from 'src/app/services/editor/editor.service';
import { StixViewPage } from '../../../stix-view-page';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { Subscription } from 'rxjs';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-collection-import-review',
  templateUrl: './collection-import-review.component.html',
  styleUrls: ['./collection-import-review.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class CollectionImportReviewComponent
  extends StixViewPage
  implements OnInit, OnDestroy
{
  private convertSubscription: Subscription;
  public converting = false;
  private deleteSubscription: Subscription;
  public deleting = false;

  public get collection(): Collection {
    return this.config.object as Collection;
  }

  public collection_import_categories = {
    technique: new CollectionDiffCategories<Technique>(),
    tactic: new CollectionDiffCategories<Tactic>(),
    campaign: new CollectionDiffCategories<Campaign>(),
    software: new CollectionDiffCategories<Software>(),
    relationship: new CollectionDiffCategories<Relationship>(),
    mitigation: new CollectionDiffCategories<Mitigation>(),
    matrix: new CollectionDiffCategories<Matrix>(),
    group: new CollectionDiffCategories<Group>(),
    data_source: new CollectionDiffCategories<DataSource>(),
    data_component: new CollectionDiffCategories<DataComponent>(),
    asset: new CollectionDiffCategories<Asset>(),
    analytic: new CollectionDiffCategories<Analytic>(),
    detection_strategy: new CollectionDiffCategories<DetectionStrategy>(),
  };

  constructor(
    public editor: EditorService,
    public apiService: RestApiConnectorService,
    private router: Router,
    authenticationService: AuthenticationService
  ) {
    super(authenticationService);
  }

  ngOnInit() {
    // set up delete watcher
    this.deleting = false;
    this.deleteSubscription = this.editor.onDeleteImportedCollection.subscribe({
      next: () => (this.deleting = true),
    });

    // set up watcher for converting an imported collection to an editable collection
    this.converting = false;
    this.convertSubscription =
      this.editor.onConvertImportedCollection.subscribe({
        next: () => {
          this.converting = true;
          this.convertToEditableCollection();
        },
      });

    // parse collection into object_import_categories
    //build category lookup
    const idToCategory = {};
    for (const category in this.collection.import_categories) {
      for (const stixId of this.collection.import_categories[category])
        idToCategory[stixId] = category;
    }

    //build ID to SDO
    const idToSdo = {};
    for (const object of this.collection.stix_contents) {
      const x = object as any;
      if (object.type != 'relationship') idToSdo[object.stixID] = x.serialize();
    }
    //parse objects into categories
    for (const object of this.collection.stix_contents) {
      if (!(object.stixID in idToCategory)) {
        // does not belong to a change category
        continue;
      }
      const category = idToCategory[object.stixID];
      switch (object.type) {
        case 'attack-pattern': //technique
          this.collection_import_categories.technique[category].push(object);
          break;
        case 'x-mitre-tactic': //tactic
          this.collection_import_categories.tactic[category].push(object);
          break;
        case 'malware': //software
        case 'tool':
          this.collection_import_categories.software[category].push(object);
          break;
        case 'relationship': //relationship
          // eslint-disable-next-line no-case-declarations
          const x = object as Relationship;
          // add source and target objects
          // eslint-disable-next-line no-case-declarations
          const serialized = x.serialize();
          serialized.workspace.workflow = {};
          if (x.source_ref in idToSdo)
            serialized.source_object = idToSdo[x.source_ref];
          if (x.target_ref in idToSdo)
            serialized.target_object = idToSdo[x.target_ref];
          this.collection_import_categories.relationship[category].push(
            new Relationship(serialized)
          );
          break;
        case 'course-of-action': //mitigation
          this.collection_import_categories.mitigation[category].push(object);
          break;
        case 'x-mitre-matrix': //matrix
          this.collection_import_categories.matrix[category].push(object);
          break;
        case 'intrusion-set': //group
          this.collection_import_categories.group[category].push(object);
          break;
        case 'x-mitre-data-source': // data source
          this.collection_import_categories.data_source[category].push(object);
          break;
        case 'x-mitre-data-component': // data component
          this.collection_import_categories.data_component[category].push(
            object
          );
          break;
        case 'campaign': // campaign
          this.collection_import_categories.campaign[category].push(object);
          break;
        case 'x-mitre-asset': // asset
          this.collection_import_categories.asset[category].push(object);
          break;
        case 'x-mitre-analytic': // analytic
          this.collection_import_categories.analytic[category].push(object);
          break;
        case 'x-mitre-detection-strategy': // detection strategy
          this.collection_import_categories.detection_strategy[category].push(
            object
          );
          break;
      }
    }
  }

  ngOnDestroy() {
    this.deleteSubscription.unsubscribe();
    if (this.convertSubscription) this.convertSubscription.unsubscribe();
  }

  public convertToEditableCollection(): void {
    // make a copy of the collection
    const serialized = this.collection.serialize();
    serialized.workspace = {}; // clear workspace/imported properties
    const collectionCopy = new Collection(serialized);
    // save new, editable collection
    const saveSubscription = collectionCopy.save(this.apiService).subscribe({
      next: (c: Collection) => {
        // route to collection edit page
        const url = `/${c.attackType}/${c.stixID}/modified/${c.modified.toISOString()}`;
        this.router.navigate([url], { queryParams: { editing: true } });
      },
      error: error => {
        console.log('Error converting to editable collection: ', error);
      },
      complete: () => {
        if (saveSubscription) saveSubscription.unsubscribe();
      },
    });
  }
}
