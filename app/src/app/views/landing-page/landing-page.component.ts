import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { stixRoutes } from "../../app-routing-stix.module";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LandingPageComponent implements OnInit {
    
    public routes: any[] = [];
    constructor() {
        this.routes = stixRoutes;
    }

    ngOnInit() {
    }

}
