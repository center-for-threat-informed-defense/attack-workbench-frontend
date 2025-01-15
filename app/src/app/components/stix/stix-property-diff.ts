import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DiffMatchPatch } from 'diff-match-patch-ts';

@Component({template: ''})
export abstract class StixPropertyDiff {
	public prettyHtmlDiff;

	constructor(public sanitizer: DomSanitizer) {
		// intentionally left blank
	}

	public generateDiffHtml(newValue, oldValue) {
		const dmp = new DiffMatchPatch();
		const diffs = dmp.diff_main(oldValue, newValue);
		dmp.diff_cleanupSemantic(diffs);
		const rawHtml = dmp.diff_prettyHtml(diffs);
		this.prettyHtmlDiff = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
	}
}