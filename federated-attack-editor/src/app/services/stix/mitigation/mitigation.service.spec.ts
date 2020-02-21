import { TestBed } from '@angular/core/testing';

import { MitigationService } from './mitigation.service';

describe('MitigationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MitigationService = TestBed.get(MitigationService);
    expect(service).toBeTruthy();
  });
});
