import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionImportReviewComponent } from './collection-import-review.component';

describe('CollectionImportReviewComponent', () => {
  let component: CollectionImportReviewComponent;
  let fixture: ComponentFixture<CollectionImportReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionImportReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionImportReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
