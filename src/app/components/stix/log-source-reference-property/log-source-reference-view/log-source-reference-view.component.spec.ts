import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogSourceReferenceViewComponent } from './log-source-reference-view.component';

describe('LogSourceReferenceViewComponent', () => {
  let component: LogSourceReferenceViewComponent;
  let fixture: ComponentFixture<LogSourceReferenceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogSourceReferenceViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogSourceReferenceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
