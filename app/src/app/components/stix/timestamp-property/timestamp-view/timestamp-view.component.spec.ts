import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimestampViewComponent } from './timestamp-view.component';

describe('TimestampViewComponent', () => {
  let component: TimestampViewComponent;
  let fixture: ComponentFixture<TimestampViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimestampViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimestampViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
