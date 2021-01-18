import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'angular-crumbs';
import { Group } from 'src/app/classes/stix/group';
import { Relationship } from 'src/app/classes/stix/relationship';
import { Software } from 'src/app/classes/stix/software';
import { Technique } from 'src/app/classes/stix/technique';
import { GroupService } from 'src/app/services/stix/group/group.service';
import { SoftwareService } from 'src/app/services/stix/software/software.service';
import { TechniqueService } from 'src/app/services/stix/technique/technique.service';
import { StixViewPage } from '../../stix-view-page';

@Component({
  selector: 'app-software-view',
  templateUrl: './software-view.component.html',
  styleUrls: ['./software-view.component.scss']
})
export class SoftwareViewComponent extends StixViewPage implements OnInit {
    public editing: boolean = false;

    public get software(): Software { return this.config.object as Software; }
    
    public relationships_techniques: Relationship[] = [];
    public relationships_groups: Relationship[] = [];

    constructor(private route: ActivatedRoute, private breadcrumbService: BreadcrumbService) { super() }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.editing = params["editing"];
        });
        // set the breadcrumb to the software name
        this.breadcrumbService.changeBreadcrumb(this.route.snapshot, this.software.name);
        // TODO set the page title to the software name using titleService
    }

}
