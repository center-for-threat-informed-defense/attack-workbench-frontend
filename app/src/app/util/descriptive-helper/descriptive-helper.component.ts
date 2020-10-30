import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-descriptive-helper',
  templateUrl: './descriptive-helper.component.html',
  styleUrls: ['./descriptive-helper.component.scss']
})
export class DescriptiveHelperComponent implements OnInit {

  @Input() public description: string; // Description
  @Input() public config: DescriptiveHelperListConfig = {};

  constructor() { }

  ngOnInit(): void {

  }

}

export interface DescriptiveHelperListConfig {
    /** firstParagraphOnly; force descriptive field to show first paragragh only */
    firstParagraphOnly?: boolean;
}