import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseTrackPageComponent } from './release-track-page.component';
import { ReleaseTracksConnectorService } from 'src/app/services/connectors/rest-api/release-tracks.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  createAsyncObservable,
  createMockReleaseTrackApiConnector,
  createPaginatedResponse,
} from 'src/app/testing/mocks/rest-api-connector.mock';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BreadcrumbService } from 'src/app/services/helpers/breadcrumb.service';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { MultipleChoiceDialogComponent } from 'src/app/components/multiple-choice-dialog/multiple-choice-dialog.component';

describe('ReleaseTrackPageComponent', () => {
  let component: ReleaseTrackPageComponent;
  let fixture: ComponentFixture<ReleaseTrackPageComponent>;
  let mockReleaseTrackApiConnector: any;
  let mockDialog: any;
  let mockRestApiConnector: any;

  beforeEach(async () => {
    mockReleaseTrackApiConnector = createMockReleaseTrackApiConnector({
      getLatestSnapshot: vi.fn(() => createAsyncObservable(null)),
      exportLatestSnapshot: vi.fn(() => createAsyncObservable({})),
      reviewCandidates: vi.fn(() => createAsyncObservable({})),
    });
    mockDialog = {
      open: vi.fn(),
    };
    mockRestApiConnector = {
      getAllObjects: vi.fn(() =>
        createAsyncObservable(createPaginatedResponse([]))
      ),
      triggerBrowserDownload: vi.fn(),
    };
    const mockBreadcrumbService = {
      changeBreadcrumb: vi.fn(),
    };
    const mockRouter = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ReleaseTrackPageComponent],
      providers: [
        {
          provide: ReleaseTracksConnectorService,
          useValue: mockReleaseTrackApiConnector,
        },
        {
          provide: RestApiConnectorService,
          useValue: mockRestApiConnector,
        },
        {
          provide: MatDialog,
          useValue: mockDialog,
        },
        {
          provide: BreadcrumbService,
          useValue: mockBreadcrumbService,
        },
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: {},
          },
        },
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

  it('should download the release track in the selected export format', () => {
    const exportPayload = { type: 'bundle', objects: [] };
    mockDialog.open.mockReturnValue({
      afterClosed: () => of('bundle'),
    });
    mockReleaseTrackApiConnector.exportLatestSnapshot.mockReturnValue(
      of(exportPayload)
    );
    component.id = 'release-track--123';
    component.releaseTrack = { name: 'Enterprise Release' } as any;

    component.onExport();

    expect(mockDialog.open).toHaveBeenCalledWith(
      MultipleChoiceDialogComponent,
      expect.objectContaining({
        data: expect.objectContaining({
          choices: expect.arrayContaining([
            expect.objectContaining({
              label: 'STIX Bundle',
              value: 'bundle',
            }),
          ]),
        }),
      })
    );
    expect(
      mockReleaseTrackApiConnector.exportLatestSnapshot
    ).toHaveBeenCalledWith('release-track--123', 'bundle', { include: 'all' });
    expect(mockRestApiConnector.triggerBrowserDownload).toHaveBeenCalledWith(
      exportPayload,
      'enterprise-release-latest-bundle.json'
    );
  });

  it('should not export when the dialog is dismissed', () => {
    mockDialog.open.mockReturnValue({
      afterClosed: () => of(null),
    });
    component.id = 'release-track--123';

    component.onExport();

    expect(
      mockReleaseTrackApiConnector.exportLatestSnapshot
    ).not.toHaveBeenCalled();
  });

  it('should not open the export dialog without a release track id', () => {
    component.id = '';

    component.onExport();

    expect(mockDialog.open).not.toHaveBeenCalled();
  });

  it('should combine candidates and staged objects for review lanes', () => {
    component.releaseTrack = {
      candidates: [
        {
          object_ref: 'attack-pattern--candidate',
          object_status: 'awaiting-review',
        },
      ],
      staged: [
        {
          object_ref: 'attack-pattern--staged',
          object_status: 'reviewed',
        },
      ],
    } as any;

    expect(component.reviewItems).toEqual([
      expect.objectContaining({
        object_ref: 'attack-pattern--candidate',
        release_track_tier: 'candidate',
      }),
      expect.objectContaining({
        object_ref: 'attack-pattern--staged',
        release_track_tier: 'staged',
      }),
    ]);
  });

  it('should review and approve a single awaiting-review candidate', () => {
    const refreshSpy = vi
      .spyOn(component, 'getReleaseTrack')
      .mockImplementation(() => undefined);
    mockReleaseTrackApiConnector.reviewCandidates.mockReturnValue(of({}));
    component.id = 'release-track--123';

    component.onReviewAndApprove({
      object_ref: 'attack-pattern--123',
      object_modified: new Date('2024-04-20T00:00:00.000Z'),
    });

    expect(mockReleaseTrackApiConnector.reviewCandidates).toHaveBeenCalledWith(
      'release-track--123',
      {
        from: 'awaiting-review',
        to: 'reviewed',
        object_refs: [
          {
            id: 'attack-pattern--123',
            modified: '2024-04-20T00:00:00.000Z',
          },
        ],
      }
    );
    expect(refreshSpy).toHaveBeenCalled();
  });

  it('should bulk review all awaiting-review candidates', () => {
    mockReleaseTrackApiConnector.reviewCandidates.mockReturnValue(of({}));
    component.id = 'release-track--123';

    component.onBulkReviewAll([
      {
        object_ref: 'attack-pattern--123',
        object_modified: '2024-04-20T00:00:00.000Z',
      },
      {
        object_ref: 'x-mitre-tactic--456',
      },
    ]);

    expect(mockReleaseTrackApiConnector.reviewCandidates).toHaveBeenCalledWith(
      'release-track--123',
      {
        from: 'awaiting-review',
        to: 'reviewed',
        object_refs: [
          {
            id: 'attack-pattern--123',
            modified: '2024-04-20T00:00:00.000Z',
          },
          'x-mitre-tactic--456',
        ],
      }
    );
  });

  it('should not send staged objects to the candidate review endpoint', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => null);
    mockReleaseTrackApiConnector.reviewCandidates.mockReturnValue(of({}));
    component.id = 'release-track--123';

    component.onBulkReviewAll([
      {
        object_ref: 'attack-pattern--candidate',
        object_modified: '2024-04-20T00:00:00.000Z',
        release_track_tier: 'candidate',
      },
      {
        object_ref: 'attack-pattern--staged',
        object_modified: '2024-04-21T00:00:00.000Z',
        release_track_tier: 'staged',
      },
    ]);

    expect(mockReleaseTrackApiConnector.reviewCandidates).toHaveBeenCalledWith(
      'release-track--123',
      {
        from: 'awaiting-review',
        to: 'reviewed',
        object_refs: [
          {
            id: 'attack-pattern--candidate',
            modified: '2024-04-20T00:00:00.000Z',
          },
        ],
      }
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'onBulkReviewAll staged objects',
      expect.arrayContaining([
        expect.objectContaining({
          object_ref: 'attack-pattern--staged',
        }),
      ])
    );
    consoleSpy.mockRestore();
  });
});
