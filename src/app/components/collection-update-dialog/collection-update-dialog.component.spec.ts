import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionUpdateDialogComponent } from './collection-update-dialog.component';

describe('CollectionUpdateDialogComponent', () => {
  let component: CollectionUpdateDialogComponent;
  let fixture: ComponentFixture<CollectionUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollectionUpdateDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
