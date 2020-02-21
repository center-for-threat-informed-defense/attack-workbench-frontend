import { Component, OnInit } from '@angular/core';
import { SoftwareService } from 'src/app/services/stix/software/software.service';
import { Software } from 'src/app/classes/stix/software';

@Component({
  selector: 'app-software-list',
  templateUrl: './software-list.component.html',
  styleUrls: ['./software-list.component.scss']
})
export class SoftwareListComponent implements OnInit {

    private software: Software[] = [];

    constructor(private softwareService: SoftwareService) { }

    ngOnInit() {
        this.software = this.softwareService.getAll();
    }

}
