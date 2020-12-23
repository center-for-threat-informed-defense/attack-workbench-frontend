import { TestBed } from '@angular/core/testing';

import { CollectionManagerConnectorService } from './collection-manager-connector.service';

describe('CollectionManagerConnectorService', () => {
  let service: CollectionManagerConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionManagerConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
