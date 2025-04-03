import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimestampPropertyComponent } from './timestamp-property.component';

describe('TimestampPropertyComponent', () => {
  let component: TimestampPropertyComponent;
  let fixture: ComponentFixture<TimestampPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimestampPropertyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimestampPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
