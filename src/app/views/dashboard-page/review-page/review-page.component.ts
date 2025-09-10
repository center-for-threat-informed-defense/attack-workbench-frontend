import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-review-page',
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ReviewPageComponent implements OnInit {
  constructor(private restApiConnector: RestApiConnectorService) {}

  ngOnInit(): void {}
}
