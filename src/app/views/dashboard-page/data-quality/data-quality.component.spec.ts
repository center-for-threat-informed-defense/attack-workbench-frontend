import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { DataQualityComponent } from './data-quality.component';
import { ReportService } from 'src/app/services/report/report.service';

describe('DataQualityComponent', () => {
  let component: DataQualityComponent;
  let fixture: ComponentFixture<DataQualityComponent>;

  const mockReportService = {
    getMissingLinkById: () => of([]),
    getParallelRelationships: () => of({}),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataQualityComponent],
      providers: [
        { provide: ReportService, useValue: mockReportService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataQualityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
