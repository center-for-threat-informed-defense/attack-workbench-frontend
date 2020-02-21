import { TestBed } from '@angular/core/testing';

import { StixService } from './stix.service';

describe('StixService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StixService = TestBed.get(StixService);
    expect(service).toBeTruthy();
  });
});
