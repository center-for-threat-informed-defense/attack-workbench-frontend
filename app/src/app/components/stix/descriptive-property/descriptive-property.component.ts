import { ExternalReference } from '@angular/compiler';
import { Component, OnInit, Input } from '@angular/core';
import { ExternalReferences } from 'src/app/classes/external-references';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-descriptive-property',
  templateUrl: './descriptive-property.component.html',
  styleUrls: ['./descriptive-property.component.scss']
})
export class DescriptivePropertyComponent implements OnInit {

  // @Input() public description: string; // Descriptive property
  @Input() public config: DescriptivePropertyListConfig;
  public displayField : string;

  private referencesList : ExternalReferences;

  constructor() { }

  private reReference = /\(Citation: (.*?)\)/gmu;

  private truncateToFirstParagraph() {
    this.displayField = this.displayField.split('\n')[0];
  }

  /**
   * remove references from descriptive property
   */
  private removeReferences() {
    this.displayField = this.displayField.replace(this.reReference, "");
  }

  /**
   * return list of references from descriptive property
   */
  private getReferencesFromDescription() {
    return this.displayField.match(this.reReference);
  }

  /**
   * Replace reference citation to be rendered as HTML
   * @param sourceName source name of the reference
   * @param completeReference complete reference e.g., (Citation: Source Name)
   */
  // private replaceCitationHTML(sourceName: string, completeReference: string) {

  //   if (this.referencesList[sourceName]) {
  //     var reference_number;
  //     var refHTML;

  //     if (this.referencesList[sourceName]['counter']) {
  //       reference_number = this.referencesList[sourceName]['counter'];
  //     }
  //     else {
  //       reference_number = this.referencesObject.currentCounter + 1;
  //       this.referencesObject.updateReference(sourceName);
  //     }
      
  //     if (this.referencesList[sourceName]['url']) {
  //         refHTML = "<span><sup><a href=\"" + this.referencesList[sourceName]['url'] + "\" class=\"externalLink\" target=\"_blank\">[" + reference_number + "]</a></sup></span>";
  //     }
  //     else{
  //       refHTML = "<span><sup>[" + reference_number + "]</sup></span>"
  //     }

  //     this.displayField = this.displayField.replace(completeReference, refHTML);

  //   }
  // }

  /**
   * Replace references from descriptive property
   */
  // private replaceReferences() {
  //   var referenceNames = this.getReferencesFromDescription()
  //   console.log(typeof referenceNames);
  //   var cleanReferenceNames = []
  //   for (var i = 0; i < referenceNames.length; i++) {
  //     cleanReferenceNames[i] = referenceNames[i].split("(Citation: ")[1].slice(0, -1);
  //     this.replaceCitationHTML(cleanReferenceNames[i], referenceNames[i]);
  //   }
  // }

  ngOnInit(): void {

    this.displayField = this.config['object']['description']

    // Avoid strikethroughs
    this.displayField = this.displayField.split('~').join("`~`");

    // Escape \ character by adding one next to it
    this.displayField = this.displayField.split('\\').join("\\\\");

    // Check if it is only the first paragraph
    if (this.config['firstParagraphOnly']) {
      this.truncateToFirstParagraph();
    }

    // Check if references will be removed
    if (this.config['removeReferences']) {
      this.removeReferences();
    }
    else {
      // Get reference list from object
      // this.referencesList = new ExternalReferences(this.config['object']['external_references']);
      // this.replaceReferences();
    }
  }

}

export interface DescriptivePropertyListConfig {
    /** firstParagraphOnly; force descriptive field to show first paragragh only */
    object: StixObject;
    /** firstParagraphOnly; force descriptive field to show first paragragh only */
    firstParagraphOnly?: boolean;
    /** removeReferences; remove references from descriptive field if true */
    externalReferences?: boolean;
}

