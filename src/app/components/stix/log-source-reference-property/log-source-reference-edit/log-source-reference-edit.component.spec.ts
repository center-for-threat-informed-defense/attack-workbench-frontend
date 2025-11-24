import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { LogSourceReferenceEditComponent } from './log-source-reference-edit.component';

describe('LogSourceReferenceEditComponent', () => {
  let component: LogSourceReferenceEditComponent;
  let fixture: ComponentFixture<LogSourceReferenceEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogSourceReferenceEditComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LogSourceReferenceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
