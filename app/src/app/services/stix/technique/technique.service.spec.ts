import { TestBed } from '@angular/core/testing';

import { TechniqueService } from './technique.service';

describe('TechniqueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TechniqueService = TestBed.get(TechniqueService);
    expect(service).toBeTruthy();
  });
});
