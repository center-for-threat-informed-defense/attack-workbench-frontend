import { TestBed } from '@angular/core/testing';

import { SoftwareService } from './software.service';

describe('SoftwareService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SoftwareService = TestBed.get(SoftwareService);
    expect(service).toBeTruthy();
  });
});
