import { TestBed } from '@angular/core/testing';

import { MatrixService } from './matrix.service';

describe('MatrixService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MatrixService = TestBed.get(MatrixService);
    expect(service).toBeTruthy();
  });
});
