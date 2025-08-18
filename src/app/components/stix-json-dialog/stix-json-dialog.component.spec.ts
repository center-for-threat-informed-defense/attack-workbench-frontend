import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StixJsonDialogComponent } from './stix-json-dialog.component';

describe('StixJsonDialogComponent', () => {
  let component: StixJsonDialogComponent;
  let fixture: ComponentFixture<StixJsonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StixJsonDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StixJsonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
