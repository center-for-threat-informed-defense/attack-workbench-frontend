import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerPropertyComponent } from './datepicker-property.component';

describe('DatepickerPropertyComponent', () => {
  let component: DatepickerPropertyComponent;
  let fixture: ComponentFixture<DatepickerPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatepickerPropertyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
