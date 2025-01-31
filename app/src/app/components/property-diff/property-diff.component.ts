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
  @Input() public before: string;
  @Input() public after: string;

  public prettyHtmlDiff: SafeHtml;

  constructor(public sanitizer: DomSanitizer) {
    // intentionally left blank
  }

  ngOnInit(): void {
    this.generateDiffHtml(this.before, this.after)
  }

  public generateDiffHtml(newValue, oldValue) {
    const dmp = new DiffMatchPatch();
    const diffs = dmp.diff_main(oldValue, newValue);
    dmp.diff_cleanupSemantic(diffs);
    const rawHtml = dmp.diff_prettyHtml(diffs);
    this.prettyHtmlDiff = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
  }
}
