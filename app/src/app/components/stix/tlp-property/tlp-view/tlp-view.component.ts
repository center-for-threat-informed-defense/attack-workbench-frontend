import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-tlp-view',
  templateUrl: './tlp-view.component.html',
  styleUrls: ['./tlp-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TlpViewComponent implements OnInit {
  @Input() public markingDefinitions: any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
