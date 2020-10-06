import { Component, OnInit } from '@angular/core';
import { TechniqueService } from 'src/app/services/stix/technique/technique.service';
import { Technique } from 'src/app/classes/stix/technique';

@Component({
  selector: 'app-technique-list',
  templateUrl: './technique-list.component.html',
  styleUrls: ['./technique-list.component.scss']
})
export class TechniqueListComponent implements OnInit {

  public techniques: Technique[] = [];

  constructor(private techniqueService: TechniqueService) { }

  ngOnInit() {
      this.techniques = this.techniqueService.getAll();
  }
}
