import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimestampDiffComponent } from './timestamp-diff.component';

describe('TimestampDiffComponent', () => {
  let component: TimestampDiffComponent;
  let fixture: ComponentFixture<TimestampDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimestampDiffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimestampDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
