import { Component, OnInit } from '@angular/core';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-notes-search-list',
  templateUrl: './notes-search-list.component.html',
  styleUrls: ['./notes-search-list.component.scss']
})
export class NotesSearchListComponent implements OnInit {

  api;
  constructor(api: RestApiConnectorService) { 
    this.api = api;
  }

  ngOnInit(): void {}

  sendSearch() : void {
    console.log('Search API call goes here');
    this.api.getAllNotes().subscribe((res)=>{
      console.log(res);
    });
  }

}
