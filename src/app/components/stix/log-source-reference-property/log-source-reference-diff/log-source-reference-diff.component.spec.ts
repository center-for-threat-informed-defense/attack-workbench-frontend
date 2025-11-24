import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { LogSourceReferenceDiffComponent } from './log-source-reference-diff.component';

describe('LogSourceReferenceDiffComponent', () => {
  let component: LogSourceReferenceDiffComponent;
  let fixture: ComponentFixture<LogSourceReferenceDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogSourceReferenceDiffComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogSourceReferenceDiffComponent);
    component = fixture.componentInstance;
    component.config = {
      mode: 'diff',
      object: [{} as any, {} as any],
      field: 'logSourceReferences',
    } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
