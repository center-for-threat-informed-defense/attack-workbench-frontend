import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-object-review-page',
  templateUrl: './object-review-page.component.html',
  styleUrls: ['./object-review-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ObjectReviewPageComponent implements OnInit {
  constructor(private restApiConnector: RestApiConnectorService) {}

  ngOnInit(): void {}
}
