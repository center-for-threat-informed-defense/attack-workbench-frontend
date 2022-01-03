import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { Paginated, RestApiConnectorService } from '../../../services/connectors/rest-api/rest-api-connector.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tlp-property',
  templateUrl: './tlp-property.component.html',
  styleUrls: ['./tlp-property.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TlpPropertyComponent implements OnInit {
  @Input() public config: TlpPropertyComponentConfig;

  public markingDefinitions : any;
  public data$: Observable<Paginated<StixObject>>;

  constructor(private restAPIConnectorService: RestApiConnectorService) { }

  ngOnInit(): void {
      let options = {
          limit: 0, 
          offset: 0,
          includeRevoked: false, 
          includeDeprecated: false
      }
      this.data$ = this.restAPIConnectorService.getAllMarkingDefinitions(options);
      let subscription = this.data$.subscribe({
          next: (data) => { if (data) this.markingDefinitions = data;},
          complete: () => { subscription.unsubscribe() }
      })
  }

}

export interface TlpPropertyComponentConfig {
  /* What is the current mode? Default: 'view
   *    view: viewing the TLP property
   *    diff: displaying the diff between two STIX objects. If this mode is selected, two StixObjects must be specified in the objects field
   */
  mode?: "view" | "diff";
  /* The object to show the TLP marking of
   * Note: if mode is diff, pass an array of two objects to diff
   */
  object: StixObject | [StixObject, StixObject];
}