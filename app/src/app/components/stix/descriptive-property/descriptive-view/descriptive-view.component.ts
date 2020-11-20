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
  public displayField : string;

  // private referencesList : ExternalReferences = config;

  constructor() { }

  private reReference = /\(Citation: (.*?)\)/gmu;

  private truncateToFirstParagraph() : void {
    this.displayField = this.displayField.split('\n')[0];
  }

  /**
   * remove references from descriptive property
   */
  private removeReferences() : void {
    this.displayField = this.displayField.replace(this.reReference, "");
  }

  /**
   * return list of references from descriptive property
   */
  private getReferencesFromDescription() : Array<string> {
    return this.displayField.match(this.reReference);
  }

  /**
   * Replace reference citation to be rendered as HTML
   * @param sourceName source name of the reference
   * @param completeReference complete reference e.g., (Citation: Source Name)
   */
  private replaceCitationHTML(sourceName: string, completeReference: string) : void {

    var reference = this.config.referencesField.getReference(sourceName);
    var reference_number = this.config.referencesField.getIndexOfReference(sourceName);

    if (reference && reference_number) {

      var refHTML = ""
      
      if (reference.url) {
          refHTML = "<span><sup><a href=\"" + reference.url + "\" class=\"external-link\" target=\"_blank\">[" + reference_number + "]</a></sup></span>";
      }
      else{
        refHTML = "<span><sup>[" + reference_number + "]</sup></span>"
      }

      this.displayField = this.displayField.replace(completeReference, refHTML);

    }
  }

  /**
   * Replace references from descriptive property
   */
  private replaceReferences() : void {
    var referenceNames = this.getReferencesFromDescription();

    var cleanReferenceNames = [];

    if(referenceNames){
      for (var i = 0; i < referenceNames.length; i++) {
        cleanReferenceNames[i] = referenceNames[i].split("(Citation: ")[1].slice(0, -1);
        this.replaceCitationHTML(cleanReferenceNames[i], referenceNames[i]);
      }
    }

  }

  ngOnInit(): void {

    this.displayField = this.config.displayField;

    // Check if it is only the first paragraph
    if (this.config.firstParagraphOnly) {
      this.truncateToFirstParagraph();
    }

    if (this.config.referencesField) {
      // Replace references from references field
      this.replaceReferences();
    }
    else {
      // Remove references if not defined
      this.removeReferences();
    }
  }

}
