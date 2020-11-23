import { Component, Input, OnInit } from '@angular/core';
import { ListPropertyConfig } from '../list-property.component';

@Component({
  selector: 'app-list-edit',
  templateUrl: './list-edit.component.html',
  styleUrls: ['./list-edit.component.scss']
})
export class ListEditComponent implements OnInit {
    @Input() public config: ListPropertyConfig;

    constructor() { }

    ngOnInit(): void {
    }

}
