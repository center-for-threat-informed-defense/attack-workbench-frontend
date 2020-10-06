import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/services/stix/group/group.service';
import { Group } from 'src/app/classes/stix/group';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

    public groups: Group[] = [];

    constructor(private groupService: GroupService) { }

    ngOnInit() {
        this.groups = this.groupService.getAll();
    }

}
