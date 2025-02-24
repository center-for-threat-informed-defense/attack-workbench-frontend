import { Component, Input, OnInit } from '@angular/core';
import { ExternalReferencesPropertyConfig } from '../external-references-property.component';
import { ExternalReference } from '@angular/compiler';

@Component({
  selector: 'app-external-references-diff',
  templateUrl: './external-references-diff.component.html',
  styleUrl: './external-references-diff.component.scss'
})
export class ExternalReferencesDiffComponent implements OnInit {
  @Input() public config: ExternalReferencesPropertyConfig;

  public get current() { return this.config.object[0]?.[this.config.referencesField].list() || []; }
  public get previous() { return this.config.object[1]?.[this.config.referencesField].list() || []; }

  public referenceDiffList: Array<{
    beforeIndex: number,
    before: ExternalReference | null,
    afterIndex: number,
    after: ExternalReference | null
  }> = [];

  ngOnInit(): void {
    this.referenceDiffList = this.mergeReferences();
    console.log(this.referenceDiffList)
  }
  
  public mergeReferences(): any[] {
    let merged = new Map();

    // add before state to map
    for (let item of this.current) {
      merged.set(item[2], {
        afterIndex: item[0], // reference index
        after: item[1], // reference description/url
        beforeIndex: null,
        before: null
      });
    }

    // add after state to map
    for (let item of this.previous) {
      if (merged.has(item[2])) {
        merged.get(item[2]).beforeIndex = item[0]; // reference index
        merged.get(item[2]).before = item[1]; // reference description/url
      } else {
        merged.set(item[2], {
          afterIndex: null,
          after: null,
          beforeIndex: item[0],
          before: item[1]
        })
      }
    }

    return Array.from(merged.values());
  }
}
