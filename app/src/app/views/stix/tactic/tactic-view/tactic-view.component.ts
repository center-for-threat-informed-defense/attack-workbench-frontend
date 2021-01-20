import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tactic } from 'src/app/classes/stix/tactic';
import { StixViewPage } from '../../stix-view-page';

@Component({
  selector: 'app-tactic-view',
  templateUrl: './tactic-view.component.html',
  styleUrls: ['./tactic-view.component.scss']
})
export class TacticViewComponent extends StixViewPage implements OnInit {
  
  public editing: boolean = false;
  public get tactic(): Tactic { return this.config.object as Tactic; }

  constructor(private route: ActivatedRoute) { 
    super()
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.editing = params["editing"];
    });
  }

}
