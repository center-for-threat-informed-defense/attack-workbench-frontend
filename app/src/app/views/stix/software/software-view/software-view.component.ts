import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/classes/stix/group';
import { Software } from 'src/app/classes/stix/software';
import { Technique } from 'src/app/classes/stix/technique';
import { GroupService } from 'src/app/services/stix/group/group.service';
import { SoftwareService } from 'src/app/services/stix/software/software.service';
import { TechniqueService } from 'src/app/services/stix/technique/technique.service';

@Component({
  selector: 'app-software-view',
  templateUrl: './software-view.component.html',
  styleUrls: ['./software-view.component.scss']
})
export class SoftwareViewComponent implements OnInit {
    public groups: Group[];
    public techniques: Technique[];

    constructor(private groupService: GroupService, private techniqueService: TechniqueService) { }

    ngOnInit() {
        this.groups = this.groupService.getAll();
        this.techniques = this.techniqueService.getAll();
    }

}
