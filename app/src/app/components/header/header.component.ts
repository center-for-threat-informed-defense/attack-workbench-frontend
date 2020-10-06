import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { stixRoutes } from "../../app-routing-stix.module";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
    public routes: any[];

    constructor(private route: ActivatedRoute) {
        this.routes = stixRoutes;
    }

    ngOnInit() {
    }

}
