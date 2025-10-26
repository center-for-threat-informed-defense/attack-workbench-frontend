import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { LogSourceReferenceViewComponent } from './log-source-reference-view.component';

describe('LogSourceReferenceViewComponent', () => {
  let component: LogSourceReferenceViewComponent;
  let fixture: ComponentFixture<LogSourceReferenceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogSourceReferenceViewComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogSourceReferenceViewComponent);
    component = fixture.componentInstance;
    component.config = {
      mode: 'view',
      object: {} as any,
      field: 'logSourceReferences',
    } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
