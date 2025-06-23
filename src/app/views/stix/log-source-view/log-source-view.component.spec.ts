import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogSourceViewComponent } from './log-source-view.component';

describe('LogSourceViewComponent', () => {
  let component: LogSourceViewComponent;
  let fixture: ComponentFixture<LogSourceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogSourceViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogSourceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
