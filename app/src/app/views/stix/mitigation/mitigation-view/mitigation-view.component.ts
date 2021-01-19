import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { StixViewPage } from '../../stix-view-page';
import { Relationship } from 'src/app/classes/stix/relationship';

@Component({
  selector: 'app-mitigation-view',
  templateUrl: './mitigation-view.component.html',
  styleUrls: ['./mitigation-view.component.scss']
})
export class MitigationViewComponent extends StixViewPage implements OnInit {
  
    public editing: boolean = false;

    public get mitigation(): Mitigation { return this.config.object as Mitigation; }

    public relationships: Relationship[] = []

    constructor(private route: ActivatedRoute) { 
        super()
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.editing = params["editing"];
        });
    }

}
