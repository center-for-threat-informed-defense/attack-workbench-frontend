import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseTrackPageComponent } from './release-track-page.component';
import { ReleaseTracksConnectorService } from 'src/app/services/connectors/rest-api/release-tracks.service';
import { provideHttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import {
  createAsyncObservable,
  createMockReleaseTrackApiConnector,
  createPaginatedResponse,
} from 'src/app/testing/mocks/rest-api-connector.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ReleaseTrackPageComponent', () => {
  let component: ReleaseTrackPageComponent;
  let fixture: ComponentFixture<ReleaseTrackPageComponent>;

  beforeEach(async () => {
    const mockReleaseTrackApiConnector = createMockReleaseTrackApiConnector({
      getAllUserAccounts: () =>
        createAsyncObservable(createPaginatedResponse([])),
    });

    await TestBed.configureTestingModule({
      declarations: [ReleaseTrackPageComponent],
      providers: [
        {
          provide: ReleaseTracksConnectorService,
          useValue: mockReleaseTrackApiConnector,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
          },
        },
        provideHttpClient(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ReleaseTrackPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
