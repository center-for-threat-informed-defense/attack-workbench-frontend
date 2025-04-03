import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionIndexViewComponent } from './collection-index-view.component';

describe('CollectionIndexViewComponent', () => {
  let component: CollectionIndexViewComponent;
  let fixture: ComponentFixture<CollectionIndexViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollectionIndexViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionIndexViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
