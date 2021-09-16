import { Component, OnInit } from '@angular/core';
import { DataSource } from 'src/app/classes/stix/data-source';
import { StixViewPage } from '../../stix-view-page';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-data-source-view',
    templateUrl: './data-source-view.component.html',
    styleUrls: ['./data-source-view.component.scss']
})
export class DataSourceViewComponent extends StixViewPage implements OnInit {
    public get data_source(): DataSource { return this.config.object as DataSource; }

    constructor(private route: ActivatedRoute) { super(); }

    ngOnInit(): void { }
}
