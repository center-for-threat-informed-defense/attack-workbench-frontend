import { TestBed } from '@angular/core/testing';

import { TacticService } from './tactic.service';

describe('TacticService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TacticService = TestBed.get(TacticService);
    expect(service).toBeTruthy();
  });
});
