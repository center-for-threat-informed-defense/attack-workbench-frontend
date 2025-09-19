import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogSourceReferenceDialogComponent } from './log-source-reference-dialog.component';

describe('LogSourceReferenceDialogComponent', () => {
  let component: LogSourceReferenceDialogComponent;
  let fixture: ComponentFixture<LogSourceReferenceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogSourceReferenceDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogSourceReferenceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
