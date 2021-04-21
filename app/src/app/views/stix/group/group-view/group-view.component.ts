import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/classes/stix/group';
import { StixViewPage } from '../../stix-view-page';
import { Relationship } from 'src/app/classes/stix/relationship';

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.scss']
})
export class GroupViewComponent extends StixViewPage implements OnInit {
  
//   public editing: boolean = false;
  
  public get group(): Group { return this.config.object as Group; }

  public relationships_techniques: Relationship[] = []

  public relationships_software: Relationship[] = []


  constructor(private route: ActivatedRoute) { 
    super()
  }

  ngOnInit() {
    // this.route.queryParams.subscribe(params => {
    //     this.editing = params["editing"];
    // });
  }

}
