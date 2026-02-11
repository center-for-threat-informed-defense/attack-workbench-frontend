import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ReportService } from 'src/app/services/report/report.service';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { StixListConfig } from 'src/app/components/stix/stix-list/stix-list.component';
import { StixListComponent } from 'src/app/components/stix/stix-list/stix-list.component';

interface ParallelRelationshipGroup {
  key: string;
  sourceRef: string;
  targetRef: string;
  relationshipType: string;
  count: number;
  relationships: any[];
}

@Component({
  selector: 'app-data-quality',
  templateUrl: './data-quality.component.html',
  styleUrls: ['./data-quality.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false, // ✅ non-standalone
})
export class DataQualityComponent implements OnInit {
  constructor(private reportService: ReportService) {}

  missingLinks: any[] = [];
  loading = false;
  error?: string;

  parallelRelationships: ParallelRelationshipGroup[] = [];
  loadingParallel = false;
  parallelError?: string;

  stixRelationshipConfig: StixListConfig = {
    type: 'relationship',
    stixObjects: [],
    clickBehavior: 'none',
    allowEdits: false,
    showControls: true,
    showFilters: false,
    showDeprecatedFilter: true,
    compactRelationshipColumns: true,
  };

  @ViewChild('relationshipList') relationshipList: StixListComponent;

  ngOnInit(): void {
    this.loadMissingLinks();
    this.loadParallelRelationships();
  }

  private transformParallelRelationships(
    raw: Record<string, any[]>
  ): ParallelRelationshipGroup[] {
    return Object.entries(raw).map(([key, relationships]) => {
      const first = relationships[0]?.stix;

      return {
        key,
        sourceRef: first?.source_ref,
        targetRef: first?.target_ref,
        relationshipType: first?.relationship_type,
        count: relationships.length,
        relationships,
      };
    });
  }

  // Helper for template: safely check if stixObjects is a non-empty array
  public get isRelationshipListEmpty(): boolean {
    const objs = this.stixRelationshipConfig?.stixObjects as unknown;
    return !(Array.isArray(objs) && objs.length > 0);
  }

  loadMissingLinks(): void {
    this.loading = true;
    this.reportService.getMissingLinkById().subscribe({
      next: data => {
        this.missingLinks = data;
        this.loading = false;
      },
      error: err => {
        this.error = 'Failed to load report';
        this.loading = false;
        console.error(err);
      },
    });
  }

  loadParallelRelationships(): void {
    this.loadingParallel = true;

    this.reportService.getParallelRelationships().subscribe({
      next: rawData => {
        this.parallelRelationships =
          this.transformParallelRelationships(rawData);

        const stixObjects: StixObject[] = [];

        this.parallelRelationships.forEach(group => {
          group.relationships.forEach(r => {
            const stix = r.stix || {};

            stixObjects.push({
              stixID: stix.id || group.key,
              type: 'relationship',
              attackType: 'relationship',
              source_ref: group.sourceRef || '',
              target_ref: group.targetRef || '',
              source_name: r.source_object?.stix?.name || '',
              target_name: r.target_object?.stix?.name || '',
              source_ID:
                r.source_object?.stix?.external_references[0].external_id || '',
              target_ID:
                r.target_object?.stix?.external_references[0].external_id || '',
              relationship_type: 'relationship',
              description: stix.description || '',
              created: stix.created || undefined,
              modified: stix.modified || undefined,
              revoked: r.revoked,
              deprecated: r.x_mitre_deprecated,
            } as any);
          });
        });

        this.stixRelationshipConfig = {
          type: 'relationship',
          stixObjects,
          clickBehavior: 'none',
          allowEdits: false,
          showControls: true,
          showFilters: false,
          showDeprecatedFilter: true,
          compactRelationshipColumns: true,
        };
        this.loadingParallel = false;
        this.parallelError = undefined;
        setTimeout(() => this.relationshipList?.applyControls(), 0);
      },
      error: err => {
        this.parallelError = 'Failed to load parallel relationships report';
        this.loadingParallel = false;
        console.error(err);
      },
    });
  }
}
