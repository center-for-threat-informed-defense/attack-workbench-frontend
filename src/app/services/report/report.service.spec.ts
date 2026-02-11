import { TestBed } from '@angular/core/testing';

import { ReportService } from './report.service';

describe('DataQualityService', () => {
  let service: ReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
