import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TimestampViewComponent } from './timestamp-view.component';

describe('TimestampViewComponent', () => {
  let component: TimestampViewComponent;
  let fixture: ComponentFixture<TimestampViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimestampViewComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimestampViewComponent);
    component = fixture.componentInstance;
    component.config = { mode: 'view', object: {} as any, field: 'created' };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
