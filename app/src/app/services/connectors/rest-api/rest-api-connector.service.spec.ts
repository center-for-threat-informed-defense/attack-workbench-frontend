import { TestBed } from '@angular/core/testing';

import { RestApiConnectorService } from './rest-api-connector.service';

describe('RestApiConnectorService', () => {
  let service: RestApiConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestApiConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
