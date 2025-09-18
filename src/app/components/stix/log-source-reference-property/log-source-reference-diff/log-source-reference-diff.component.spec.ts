import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogSourceReferenceDiffComponent } from './log-source-reference-diff.component';

describe('LogSourceReferenceDiffComponent', () => {
  let component: LogSourceReferenceDiffComponent;
  let fixture: ComponentFixture<LogSourceReferenceDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogSourceReferenceDiffComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogSourceReferenceDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
