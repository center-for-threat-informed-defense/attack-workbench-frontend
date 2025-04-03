import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StixDialogComponent } from './stix-dialog.component';

describe('StixDialogComponent', () => {
  let component: StixDialogComponent;
  let fixture: ComponentFixture<StixDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StixDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StixDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
