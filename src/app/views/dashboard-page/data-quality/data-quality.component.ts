import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ReportService } from 'src/app/services/report/report.service';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { StixListConfig } from 'src/app/components/stix/stix-list/stix-list.component';
import { StixTypeToAttackType } from 'src/app/utils/type-mappings';
import { StixListComponent } from 'src/app/components/stix/stix-list/stix-list.component';

interface ParallelRelationshipGroup {
  key: string;
  sourceRef: string;
  targetRef: string;
  relationshipType: string;
  count: number;
  relationships: any[];
  stixObjects?: StixObject[];
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
  nonRelationshipMissingLinks: any[] = [];
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
    showCreatedModified: true,
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

  // Build a link to the workbench object page using STIX->ATT&CK mapping
  objectLink(item: any): any[] {
    const id = item.stix.id;
    const stixType = item.stix.type as keyof typeof StixTypeToAttackType;
    const attackType = StixTypeToAttackType[stixType];
    return ['/', attackType, id];
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
        this.nonRelationshipMissingLinks = Array.isArray(data)
          ? data.filter(item => {
              const type = item.stix.type;
              return type !== 'relationship';
            })
          : [];
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

        // Build per-group stixObjects once and cache on the group
        this.parallelRelationships.forEach(group => {
          group.stixObjects = this.buildStixObjectsForGroup(group);
        });
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

  // Build a StixList-compatible array for a given group
  buildStixObjectsForGroup(group: ParallelRelationshipGroup): StixObject[] {
    if (!group || !Array.isArray(group.relationships)) return [] as any;
    return group.relationships.map(r =>
      this.mapRelationshipToRow(r)
    ) as any;
  }

  // Use existing config and override only the stixObjects (and hide controls in panels)
  stixConfigForGroup(group: ParallelRelationshipGroup): StixListConfig {
    return {
      ...this.stixRelationshipConfig,
      stixObjects: group.stixObjects || this.buildStixObjectsForGroup(group),
      showControls: false,
    };
  }

  // Centralized row mapping used by builders
  private mapRelationshipToRow(
    r: any,
  ): StixObject {
    const stix = r.stix;
    return {
      stixID: stix.id,
      type: 'relationship',
      source_ref: stix.source_ref || '',
      target_ref: stix.target_ref || '',
      source_name: r.source_object.stix.name || '',
      target_name: r.target_object.stix.name || '',
      source_ID: r.source_object.stix.external_references[0].external_id || '',
      target_ID: r.target_object.stix.external_references[0].external_id || '',
      relationship_type: stix.relationship_type,
      description: stix.description || '',
      created: stix.created || undefined,
      modified: stix.modified || undefined,
      revoked: r?.revoked,
      deprecated: r?.x_mitre_deprecated,
    } as any;
  }
}
