import { Component, OnInit } from '@angular/core';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { MitigationService } from 'src/app/services/stix/mitigation/mitigation.service';

@Component({
  selector: 'app-mitigation-list',
  templateUrl: './mitigation-list.component.html',
  styleUrls: ['./mitigation-list.component.scss']
})
export class MitigationListComponent implements OnInit {

    public mitigations: Mitigation[] = [];

    constructor(private mitigationService: MitigationService) { }

    ngOnInit() {
        this.mitigations = this.mitigationService.getAll();
    }
}
