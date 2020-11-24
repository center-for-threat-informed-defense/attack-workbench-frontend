import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { DescriptivePropertyConfig } from '../descriptive-property.component';

@Component({
  selector: 'app-descriptive-view',
  templateUrl: './descriptive-view.component.html',
  styleUrls: ['./descriptive-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DescriptiveViewComponent implements OnInit {

  // @Input() public description: string; // Descriptive view
  @Input() public config: DescriptivePropertyConfig;

  constructor() { }

  private reReference = /\(Citation: (.*?)\)/gmu;

  private truncateToFirstParagraph(displayStr: string) : string {
    return displayStr.split('\n')[0];
  }

  /**
   * remove references from descriptive property
   */
  private removeReferences(displayStr: string) : string {
    return displayStr.replace(this.reReference, "");
  }

  /**
   * return list of references from descriptive property
   */
  private getReferencesFromDescription(displayStr: string) : Array<string> {
    return displayStr.match(this.reReference);
  }

  /**
   * Replace reference citation to be rendered as HTML
   * @param sourceName source name of the reference
   * @param completeReference complete reference e.g., (Citation: Source Name)
   */
  private replaceCitationHTML(displayStr: string, sourceName: string, completeReference: string) : string {

    let reference = this.config.referencesField.getReference(sourceName);
    let reference_number = this.config.referencesField.getIndexOfReference(sourceName);

    if (reference && reference_number) {

      let refHTML = ""
      
      if (reference.url) {
          refHTML = "<span><sup><a href=\"" + reference.url + "\" class=\"external-link\" target=\"_blank\">[" + reference_number + "]</a></sup></span>";
      }
      else{
        refHTML = "<span><sup>[" + reference_number + "]</sup></span>"
      }

      return displayStr.replace(completeReference, refHTML);

    }

    return displayStr;
  }

  /**
   * Replace references from descriptive property
   */
  private replaceReferences(displayStr : string) : string {
    let referenceNames = this.getReferencesFromDescription(displayStr);

    let cleanReferenceNames = [];

    if(referenceNames){
      for (let i = 0; i < referenceNames.length; i++) {
        cleanReferenceNames[i] = referenceNames[i].split("(Citation: ")[1].slice(0, -1);
        displayStr = this.replaceCitationHTML(displayStr, cleanReferenceNames[i], referenceNames[i]);
      }
    }

    return displayStr;

  }

  /**
   * get the descriptive view of of the stix object
   */
  public get display(): string {

    let displayStr : string = this.config.object[this.config.field];

    // Check if it is only the first paragraph
    if (this.config.firstParagraphOnly) {
      displayStr = this.truncateToFirstParagraph(displayStr);
    }

    if (this.config.referencesField) {
      // Replace references from references field
      displayStr = this.replaceReferences(displayStr);
    }
    else {
      // Remove references if not defined
      displayStr = this.removeReferences(displayStr);
    }

    return displayStr;
  }

  ngOnInit(): void {

  }

}
