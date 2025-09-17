import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, ViewEncapsulation } from '@angular/core';
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
import { CollectionDiffCategories } from 'src/app/classes/stix/collection';

@Component({
  selector: 'app-collection-import-summary',
  templateUrl: './collection-import-summary.component.html',
  styleUrls: ['./collection-import-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class CollectionImportSummaryComponent {
  @Input() config: CollectionImportSummaryConfig;

  public format(attackType: string): string {
    return attackType.replace(/_/g, ' ');
  }
}

export interface CollectionImportSummaryConfig {
  object_import_categories: {
    technique: CollectionDiffCategories<Technique>;
    tactic: CollectionDiffCategories<Tactic>;
    campaign: CollectionDiffCategories<Campaign>;
    software: CollectionDiffCategories<Software>;
    relationship: CollectionDiffCategories<Relationship>;
    mitigation: CollectionDiffCategories<Mitigation>;
    matrix: CollectionDiffCategories<Matrix>;
    group: CollectionDiffCategories<Group>;
    data_source: CollectionDiffCategories<DataSource>;
    data_component: CollectionDiffCategories<DataComponent>;
    asset: CollectionDiffCategories<Asset>;
    analytic: CollectionDiffCategories<Analytic>;
    detection_strategy: CollectionDiffCategories<DetectionStrategy>;
  };
  select?: SelectionModel<string>;
}
