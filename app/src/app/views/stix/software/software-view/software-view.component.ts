import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'angular-crumbs';
import { Relationship } from 'src/app/classes/stix/relationship';
import { Software } from 'src/app/classes/stix/software';
import { StixViewPage } from '../../stix-view-page';

@Component({
  selector: 'app-software-view',
  templateUrl: './software-view.component.html',
  styleUrls: ['./software-view.component.scss']
})
export class SoftwareViewComponent extends StixViewPage implements OnInit {
    public editing: boolean = false;

    public get software(): Software { return this.config.object as Software; }
    
    constructor(private route: ActivatedRoute, private breadcrumbService: BreadcrumbService) { super() }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.editing = params["editing"];
        });
    }

}
