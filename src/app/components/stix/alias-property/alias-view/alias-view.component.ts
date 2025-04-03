import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AliasPropertyConfig } from '../alias-property.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-alias-view',
  templateUrl: './alias-view.component.html',
  styleUrls: ['./alias-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('detailExpand', [
      transition(':enter', [
        style({ height: '0px', minHeight: '0px' }),
        animate('100ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ height: '*' })),
      ]),
      transition(':leave', [
        animate(
          '100ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          style({ height: '0px', minHeight: '0px' })
        ),
      ]),
    ]),
  ],
})
export class AliasViewComponent implements OnInit {
  @Input() public config: AliasPropertyConfig;
  private reReference = /\(Citation: (.*?)\)/gmu;
  public showMore = false;
  public expandedDetails: {
    name: string;
    description: string;
  }[] = [];

  public toggleMore(): void {
    this.showMore = !this.showMore;
  }

  public get wrap() {
    return this.config.hasOwnProperty('wrap') ? this.config.wrap : true;
  }

  constructor() {
    // intentionally left blank
  }

  ngOnInit(): void {
    this.formatExpandedDetails();
  }

  /**
   * return list of aliass with inline citations
   */
  public get inlineCitations() {
    const aliases = this.config.object[this.config.field].slice(1);
    if (this.config.referencesField) {
      let value: string;
      const aliasArray: string[] = [];

      let arraySize = aliases.length;
      for (value of aliases) {
        let alias = value;
        if (this.config.object[this.config.referencesField].hasValue(value)) {
          // Get citations from description
          const descr =
            this.config.object[this.config.referencesField].getDescription(
              value
            );
          const referenceNamesFromDescr =
            this.getReferencesFromDescription(descr);
          let referencesStr = '';
          const referenceNames = [];
          if (referenceNamesFromDescr) {
            for (let i = 0; i < referenceNamesFromDescr.length; i++) {
              referenceNames[i] = referenceNamesFromDescr[i]
                .split('(Citation: ')[1]
                .slice(0, -1);
              referencesStr =
                referencesStr +
                this.getReferenceStr(
                  referenceNames[i],
                  referenceNamesFromDescr[i]
                );
            }
          }
          alias = alias + referencesStr;
        }

        // Add ',' if it is not the last iteration
        if (--arraySize) {
          alias = alias + ';';
        }
        aliasArray.push(alias);
      }
      return aliasArray;
    }
    return aliases;
  }

  /**
   * return list of aliases with descriptive text
   */
  public formatExpandedDetails(): void {
    if (this.config.referencesField) {
      let value: string;
      this.expandedDetails = [];

      for (value of this.config.object[this.config.field]) {
        let displayStr = '';

        if (this.config.object[this.config.referencesField].hasValue(value)) {
          // Get citations from description
          displayStr =
            this.config.object[this.config.referencesField].getDescription(
              value
            );
          const referenceNamesFromDescr: string[] =
            this.getReferencesFromDescription(displayStr);
          const referenceNames: string[] = [];

          if (
            referenceNamesFromDescr &&
            this.hasDescriptiveProperty(displayStr, referenceNamesFromDescr)
          ) {
            for (let i = 0; i < referenceNamesFromDescr.length; i++) {
              referenceNames[i] = referenceNamesFromDescr[i]
                .split('(Citation: ')[1]
                .slice(0, -1);
              displayStr = this.replaceCitationHTML(
                displayStr,
                referenceNames[i],
                referenceNamesFromDescr[i]
              );
            }
          }
          if (this.hasDescriptiveProperty(displayStr, referenceNamesFromDescr))
            this.expandedDetails.push({ name: value, description: displayStr });
        }
      }
    }
  }

  /**
   * Replace reference citation to be rendered as HTML
   * @param sourceName source name of the reference
   * @param completeReference complete reference e.g., (Citation: Source Name)
   */
  private replaceCitationHTML(
    displayStr: string,
    sourceName: string,
    completeReference: string
  ): string {
    const reference =
      this.config.object[this.config.referencesField].getReference(sourceName);
    const reference_number =
      this.config.object[this.config.referencesField].getIndexOfReference(
        sourceName
      );

    if (reference && reference_number) {
      let refHTML = '';

      if (reference.url) {
        refHTML =
          '<span><sup><a href="' +
          reference.url +
          '" class="external-link" target="_blank">[' +
          reference_number +
          ']</a></sup></span>';
      } else {
        refHTML = '<span><sup>[' + reference_number + ']</sup></span>';
      }
      return displayStr.replace(completeReference, refHTML);
    }
    return displayStr;
  }

  /**
   * Determine if string is only made by citations
   * @param displayStr string to be verified
   * @param completeReferences list of complete reference names
   */
  private hasDescriptiveProperty(
    displayStr: string,
    completeReferences: string[]
  ): boolean {
    if (!completeReferences && displayStr) return true;
    let displayStrCopy = displayStr;

    // Remove citations from string
    for (let i = 0; i < completeReferences.length; i++) {
      displayStrCopy = displayStrCopy.replace(completeReferences[i], '');
    }

    // Remove spaces
    displayStrCopy = displayStrCopy.replace(/\s/g, '');

    // Check that there is a string after replacing citations
    if (displayStrCopy) {
      return true;
    }
    return false;
  }

  /**
   * return list of references from descriptive property
   * @param displayStr string that may contains references
   */
  private getReferencesFromDescription(displayStr: string): string[] {
    return displayStr.match(this.reReference);
  }

  /**
   * return HTML string of reference
   * @param sourceName source name of the reference
   * @param completeReference complete reference e.g., (Citation: Source Name)
   */
  private getReferenceStr(
    sourceName: string,
    completeReference: string
  ): string {
    const reference =
      this.config.object[this.config.referencesField].getReference(sourceName);
    const reference_number =
      this.config.object[this.config.referencesField].getIndexOfReference(
        sourceName
      );

    if (reference && reference_number) {
      if (reference.url) {
        return (
          '<span><sup><a href="' +
          reference.url +
          '" class="external-link" target="_blank">[' +
          reference_number +
          ']</a></sup></span>'
        );
      } else {
        return '<span><sup>[' + reference_number + ']</sup></span>';
      }
    }
    return '';
  }

  /**
   * return true if an associtation has descriptions
   */
  public includeMoreSection(): boolean {
    let value: string;

    for (value of this.config.object[this.config.field]) {
      if (this.config.object[this.config.referencesField].hasValue(value)) {
        // Get citations from description
        const displayStr =
          this.config.object[this.config.referencesField].getDescription(value);
        const referenceNamesFromDescr: string[] =
          this.getReferencesFromDescription(displayStr);

        if (this.hasDescriptiveProperty(displayStr, referenceNamesFromDescr)) {
          return true;
        }
      }
    }
    return false;
  }
}
