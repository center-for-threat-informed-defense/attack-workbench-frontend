import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionImportSummaryComponent } from './collection-import-summary.component';

describe('CollectionImportSummaryComponent', () => {
  let component: CollectionImportSummaryComponent;
  let fixture: ComponentFixture<CollectionImportSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionImportSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionImportSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
