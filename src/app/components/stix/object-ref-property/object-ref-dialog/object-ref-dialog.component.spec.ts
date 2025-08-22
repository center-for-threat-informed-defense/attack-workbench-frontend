import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectRefDialogComponent } from './object-ref-dialog.component';

describe('ObjectRefDialogComponent', () => {
  let component: ObjectRefDialogComponent;
  let fixture: ComponentFixture<ObjectRefDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObjectRefDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectRefDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
