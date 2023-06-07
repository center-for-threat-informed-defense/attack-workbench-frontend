import { TestBed } from '@angular/core/testing';

import { WebsiteIntegrationService } from './website-integration.service';

describe('WebsiteIntegrationService', () => {
  let service: WebsiteIntegrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsiteIntegrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
