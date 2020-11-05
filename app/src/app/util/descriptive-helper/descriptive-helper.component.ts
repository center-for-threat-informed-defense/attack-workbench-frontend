import { Component, OnInit, Input } from '@angular/core';
import { MarkdownComponent, MarkdownService } from 'ngx-markdown';
import { ExternalReferences } from 'src/app/classes/external-references';

@Component({
  selector: 'app-descriptive-helper',
  templateUrl: './descriptive-helper.component.html',
  styleUrls: ['./descriptive-helper.component.scss']
})
export class DescriptiveHelperComponent implements OnInit {

  @Input() public description: string; // Description
  @Input() public config: DescriptiveHelperListConfig = {};
  @Input() public referencesObject: ExternalReferences;

  private referencesList = {};

  constructor() { }

  private reReference = /\(Citation: (.*?)\)/gmu;

  private getFirstParagraph() {
    this.description = this.description.split('\n')[0];
  }

  private removeReferences() {
    // Remove references
    this.description = this.description.replace(this.reReference, "");
  }

  private getReferencesFromDescription() {
    // Get list of references
    return this.description.match(this.reReference);
  }

  private replaceCitationHTML(sourceName: string, completeReference: string) {

    if (this.referencesList[sourceName]) {
      var reference_number;
      var refHTML;

      if (this.referencesList[sourceName]['counter']) {
        reference_number = this.referencesList[sourceName]['counter'];
      }
      else {
        reference_number = this.referencesObject.getCurrentCounter() + 1;
        this.referencesObject.updateReference(sourceName);
      }
      
      if (this.referencesList[sourceName]['url']) {
          refHTML = "<span><sup><a href=\"" + this.referencesList[sourceName]['url'] + "\" target=\"_blank\">[" + reference_number + "]</a></sup></span>";
      }
      else{
        refHTML = "<span><sup>[" + reference_number + "]</sup></span>"
      }

      this.description = this.description.replace(completeReference, refHTML);

    }
  }

  private replaceReferences() {
    var referenceNames = this.getReferencesFromDescription()
    var cleanReferenceNames = []
    for (var i = 0; i < referenceNames.length; i++) {
      cleanReferenceNames[i] = referenceNames[i].split("(Citation: ")[1].slice(0, -1);
      this.replaceCitationHTML(cleanReferenceNames[i], referenceNames[i]);
    }
  }

  ngOnInit(): void {

    // Get reference list from object
    this.referencesList = this.referencesObject.getExternalReferences()

    // Avoid strikethroughs
    this.description = this.description.split('~').join("`~`");

    // Check if it is only the first paragraph
    if (this.config['firstParagraphOnly']) {
      this.getFirstParagraph();
    }

    // Check if references will be removed
    if (this.config['removeReferences']) {
      this.removeReferences();
    }

    if (this.referencesList) {
      this.replaceReferences();
    }
  }

}

export interface DescriptiveHelperListConfig {
    /** firstParagraphOnly; force descriptive field to show first paragragh only */
    firstParagraphOnly?: boolean;
    /** removeReferences; remove references from descriptive field if true */
    removeReferences?: boolean;
}