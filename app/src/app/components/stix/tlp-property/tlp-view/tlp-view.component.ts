import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-tlp-view',
  templateUrl: './tlp-view.component.html',
  styleUrls: ['./tlp-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TlpViewComponent implements OnInit {
  @Input() public tlp: string;

  public tlpClass() : string {
    if (this.tlp == "red") return "tlp-red";
    else if (this.tlp == "amber") return "tlp-amber";
    else if (this.tlp == "green") return "tlp-green";
    else if (this.tlp == "white") return "tlp-white";
    else return "";
  }
  
  constructor() { }

  ngOnInit(): void {
  }

}
