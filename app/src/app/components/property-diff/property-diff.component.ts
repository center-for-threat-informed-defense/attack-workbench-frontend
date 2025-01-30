import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DiffMatchPatch } from 'diff-match-patch-ts';

@Component({
  selector: 'app-property-diff',
  templateUrl: './property-diff.component.html',
  styleUrls: ['./property-diff.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PropertyDiffComponent implements OnInit  {
  @Input() public config: PropertyDiffConfig;
  public prettyHtmlDiff: SafeHtml;

  public get isHeader() {
    return this.config.header ? this.config.header : false;
  }

  constructor(public sanitizer: DomSanitizer) {
    // intentionally left blank
  }

  ngOnInit(): void {
    console.log('** property diff component', this.config)
    this.generateDiffHtml(this.config.before, this.config.after)
  }

  public generateDiffHtml(newValue, oldValue) {
    const dmp = new DiffMatchPatch();
    const diffs = dmp.diff_main(oldValue, newValue);
    dmp.diff_cleanupSemantic(diffs);
    const rawHtml = dmp.diff_prettyHtml(diffs);
    this.prettyHtmlDiff = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
  }
}

export interface PropertyDiffConfig {
    /* mode; displaying the diff between two STIX objects. Two StixObjects must be specified in the objects field */
    mode?: "diff";
    /* before; the StixObject version pre-change */
    before: string;
    /* objAfter; the StixObject version post-change */
    after: string;
    /* field; field of object to be displayed */
    field: string;
    /* label; label for labelled box */
    label?: string;
    /* whether field should be displayed as a header; default false */
    header?: boolean;
}