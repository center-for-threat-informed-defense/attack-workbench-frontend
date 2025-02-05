import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AliasPropertyConfig } from '../alias-property.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-alias-diff',
  templateUrl: './alias-diff.component.html',
  styleUrl: './alias-diff.component.scss',
  encapsulation: ViewEncapsulation.None,
  animations: [
      trigger("detailExpand", [
          transition(":enter", [
              style({ height: '0px', minHeight: '0px' }),
              animate("100ms cubic-bezier(0.4, 0.0, 0.2, 1)", style({ height: '*' }))
          ]),
          transition(':leave', [
              animate('100ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ height: '0px', minHeight: '0px' }))
          ])
      ])
  ]
})
export class AliasDiffComponent implements OnInit {
  @Input() public config: AliasPropertyConfig;
  private reReference = /\(Citation: (.*?)\)/gmu;
  public showMore: boolean = false;
  public expandedDetails: {
    name: string,
    before: string,
    after: string
  }[] = [];
  public inlineCitations;

  public toggleMore(): void { this.showMore = !this.showMore; }

  public get wrap() { return this.config.hasOwnProperty('wrap') ? this.config.wrap : true; }

  public get before() { return this.config.object[0]; }
  public get aliasesBefore() { return this.before?.[this.config.field].slice(1).join('; ') || ''; }

  public get after() { return this.config.object[1]; }
  public get aliasesAfter() { return this.after?.[this.config.field].slice(1).join('; ') || ''; }

  constructor() {
      // intentionally left blank
  }

  ngOnInit(): void {
      this.formatExpandedDetails();
  }

  /**
   * return alias descriptions with diffs
   */
  public formatExpandedDetails(): void {
    this.expandedDetails = [];
    this.showMore = false;

    let beforeList = this.before?.[this.config.field].slice(1) || [];
    let afterList = this.after?.[this.config.field].slice(1) || [];

    let allAliases = new Set([...beforeList, ...afterList]);

    allAliases.forEach(alias => {
      let beforeDescr = this.getDescription(alias, 0);
      let afterDescr = this.getDescription(alias, 1);

      if (beforeDescr || afterDescr) {
        this.expandedDetails.push({
          name: alias,
          before: beforeDescr,
          after: afterDescr
        });

        if (beforeDescr !== afterDescr) this.showMore = true;
      }
    });
  }

  private getDescription(alias: string, index: number): string {
    if (!this.config.referencesField || !this.config.object[index]?.[this.config.referencesField]?.hasValue(alias)) return '';
    return this.config.object[index][this.config.referencesField].getDescription(alias);
  }

  public getBeforeName(alias: string): string {
    return this.before?.[this.config.field]?.includes(alias) ? alias : '';
  }

  public getAfterName(alias: string): string {
    return this.after?.[this.config.field]?.includes(alias) ? alias : '';
  }

  /**
   * return true if an associtation has descriptions
   */
  public includeMoreSection(): boolean {
    return this.expandedDetails.length > 0;
  }
}
