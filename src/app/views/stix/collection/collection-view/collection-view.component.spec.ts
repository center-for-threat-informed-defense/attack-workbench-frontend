import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CollectionViewComponent } from './collection-view.component';

describe('CollectionViewComponent', () => {
  let component: CollectionViewComponent;
  let fixture: ComponentFixture<CollectionViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
