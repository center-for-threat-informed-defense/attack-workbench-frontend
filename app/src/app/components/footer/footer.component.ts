import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { version, name } from "../../../../package.json";
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    private appVersion: string = version;
    private appName: string = name;
    constructor() { }
    
    ngOnInit() {
    }

}
