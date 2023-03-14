import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';

@Component({
  selector: 'app-notes-search-list',
  templateUrl: './notes-search-list.component.html',
  styleUrls: ['./notes-search-list.component.scss']
})
export class NotesSearchListComponent implements OnInit {
  constructor(private sidebarService: SidebarService) { 
  }

  ngOnInit(): void {
    this.sidebarService.opened = false;
  }

}
