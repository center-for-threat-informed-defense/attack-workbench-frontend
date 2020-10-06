import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { version, name } from "../../../../package.json";
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    public appVersion: string = version;
    public appName: string = name;
    constructor() { }
    
    ngOnInit() {
    }

}
