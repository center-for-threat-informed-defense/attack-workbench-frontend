import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceEditDialogComponent } from './reference-edit-dialog.component';

describe('ReferenceEditDialogComponent', () => {
  let component: ReferenceEditDialogComponent;
  let fixture: ComponentFixture<ReferenceEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferenceEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
